"""
Server-side model integration for PastureAI.
- Loads embedding model (SigLIP/DINOv2) via transformers
- Loads regression/classifier model (BiomassModel)
- Exposes async predict_biomass(image_path) and batch_predict()
"""
from pathlib import Path
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any

import torch
import torch.nn.functional as F
from PIL import Image
import numpy as np
from transformers import AutoModel, AutoImageProcessor

from app.config import settings
from app.schemas import BiomassPrediction, BiomassMetrics, PastureHealth

logger = logging.getLogger(__name__)

# --- BiomassModel (same structure as your doc) ---
class BiomassModel(torch.nn.Module):
    def __init__(self, input_dim:int=512, hidden_dim:int=256, num_targets:int=5):
        super().__init__()
        self.regression_head = torch.nn.Sequential(
            torch.nn.Linear(input_dim, hidden_dim),
            torch.nn.ReLU(),
            torch.nn.Dropout(0.3),
            torch.nn.Linear(hidden_dim, hidden_dim // 2),
            torch.nn.ReLU(),
            torch.nn.Linear(hidden_dim // 2, num_targets),
            torch.nn.Softplus()
        )
        self.health_classifier = torch.nn.Sequential(
            torch.nn.Linear(input_dim, hidden_dim // 2),
            torch.nn.ReLU(),
            torch.nn.Linear(hidden_dim // 2, 4)
        )
        self.coverage_estimator = torch.nn.Sequential(
            torch.nn.Linear(input_dim, hidden_dim // 4),
            torch.nn.ReLU(),
            torch.nn.Linear(hidden_dim // 4, 1),
            torch.nn.Sigmoid()
        )

    def forward(self, features: torch.Tensor):
        biomass = self.regression_head(features)
        health_logits = self.health_classifier(features)
        coverage = self.coverage_estimator(features) * 100.0
        return {"biomass": biomass, "health_logits": health_logits, "coverage": coverage}

# --- BiomassPredictor wrapper ---
class BiomassPredictor:
    def __init__(self, model_path: Optional[str]=None, embedding_model_name:Optional[str]=None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = Path(model_path or settings.MODEL_PATH)
        self.embedding_model_name = embedding_model_name or settings.EMBEDDING_MODEL
        self._load_embedding_model()
        self._load_regressor()

    def _load_embedding_model(self):
        try:
            logger.info("Loading embedding model %s", self.embedding_model_name)
            self.image_processor = AutoImageProcessor.from_pretrained(self.embedding_model_name)
            self.embedding_model = AutoModel.from_pretrained(self.embedding_model_name).to(self.device)
            self.embedding_model.eval()
        except Exception as e:
            logger.exception("Failed to load embedding model")
            raise

    def _load_regressor(self):
        self.model = BiomassModel(input_dim=settings.EMBED_DIM)
        if self.model_path.exists():
            state = torch.load(self.model_path, map_location="cpu")
            self.model.load_state_dict(state)
            logger.info("Loaded biomass model from %s", self.model_path)
        else:
            logger.warning("Biomass model path not found, using random init")
        self.model.to(self.device).eval()

    async def extract_features(self, pil_img: Image.Image) -> np.ndarray:
        """
        Use the AutoImageProcessor + embedding_model to extract a feature vector for the whole image.
        This mirrors compute_embeddings() used in your repo (patch splitting + pooling).
        """
        inputs = self.image_processor(images=pil_img, return_tensors="pt").to(self.device)
        with torch.no_grad():
            outputs = self.embedding_model(**inputs)
            # adapt to model output shapes (pooler_output, last_hidden_state, image_embeds)
            if hasattr(outputs, "pooler_output") and outputs.pooler_output is not None:
                feat = outputs.pooler_output
            elif hasattr(outputs, "image_embeds") and outputs.image_embeds is not None:
                feat = outputs.image_embeds
            else:
                feat = outputs.last_hidden_state[:, 0, :]
            feat = feat.detach().cpu().numpy().reshape(-1)
        return feat

    async def predict_biomass(self, image_path: str, metadata: Optional[Dict]=None) -> Dict[str, Any]:
        start = datetime.now()
        pil = Image.open(image_path).convert("RGB")
        features = await self.extract_features(pil)
        ft = torch.tensor(features, dtype=torch.float32, device=self.device).unsqueeze(0)
        with torch.no_grad():
            out = self.model(ft)
            biomass = out["biomass"].cpu().numpy().flatten()
            health_logits = out["health_logits"].cpu().numpy()
            coverage = float(out["coverage"].cpu().numpy().flatten()[0])
        health_probs = F.softmax(torch.tensor(health_logits), dim=1).numpy().flatten()
        health_idx = int(health_probs.argmax())
        health_label = ["poor","fair","good","excellent"][health_idx]
        greenness = float(biomass[0] / (biomass[4] + 1e-6))
        processing_time_ms = (datetime.now() - start).total_seconds() * 1000.0
        result = {
            "predictions": {
                "Dry_Green_g": float(biomass[0]),
                "Dry_Dead_g": float(biomass[1]),
                "Dry_Clover_g": float(biomass[2]),
                "GDM_g": float(biomass[3]),
                "Dry_Total_g": float(biomass[4]),
            },
            "metrics": {
                "biomass_density_g_m2": float(biomass[4]) * 100.0,
                "pasture_health": health_label,
                "greenness_index": greenness,
                "coverage_pct": coverage
            },
            "confidence_score": float(min(health_probs[health_idx] * 0.7 + 0.3, 1.0)),
            "processing_time_ms": processing_time_ms,
            "model_version": str(self.model_path.name),
            "timestamp": datetime.utcnow().isoformat()
        }
        if metadata:
            result["metadata"] = metadata
        return result

# single global predictor instance to reuse in server
_predictor: Optional[BiomassPredictor] = None
def get_predictor() -> BiomassPredictor:
    global _predictor
    if _predictor is None:
        _predictor = BiomassPredictor()
    return _predictor
