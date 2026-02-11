"""
Image2Biomass inference: TorchScript model prediction per tile.
"""
import torch
import numpy as np
from pathlib import Path
from typing import Dict, Optional

_MODEL: Optional[torch.ScriptModule] = None


def load_model(path: str) -> torch.ScriptModule:
    global _MODEL
    p = Path(path)
    if not p.exists():
        return None
    _MODEL = torch.jit.load(str(p), map_location="cpu")
    _MODEL.eval()
    return _MODEL


def get_model():
    return _MODEL


def read_tile_image(pasture_id: str, z: int, x: int, y: int):
    """Load tile GeoTIFF from local storage or S3. Placeholder for demo."""
    tile_path = Path(f"/data/orthos/{pasture_id}/{z}/{x}/{y}.tif")
    if not tile_path.exists():
        # Fallback: synthetic for demo
        arr = np.random.rand(4, 256, 256).astype("float32") * 8000
        return arr, None
    import rasterio
    with rasterio.open(tile_path) as src:
        arr = src.read()
        transform = src.transform
    return arr.astype("float32"), transform


def predict_patch(
    model, pasture_id: str, z: int, x: int, y: int, sources: list = None
) -> Dict:
    if model is None:
        # Mock response when model not loaded
        mean = 2.5 + np.random.randn() * 0.5
        std = 0.3
        return {
            "pastureId": pasture_id,
            "tile": {"z": z, "x": x, "y": y},
            "biomass_mean_t_ha": round(mean, 2),
            "biomass_std_t_ha": round(std, 2),
            "model_version": "mock",
        }

    img, transform = read_tile_image(pasture_id, z, x, y)
    img = img / 10000.0
    t = torch.from_numpy(img).unsqueeze(0)

    with torch.no_grad():
        pred = model(t)
        pred = pred.squeeze(0).numpy()

    mean = float(np.mean(pred))
    std = float(np.std(pred))
    return {
        "pastureId": pasture_id,
        "tile": {"z": z, "x": x, "y": y},
        "biomass_mean_t_ha": round(mean, 2),
        "biomass_std_t_ha": round(std, 2),
        "model_version": "v3.2-ts",
    }
