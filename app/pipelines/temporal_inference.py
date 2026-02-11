# app/pipelines/temporal_inference.py
"""
Temporal inference: sequence → next-day biomass forecast.
Uses BiomassRNN when weights exist; falls back to growth-curve heuristic when not.
Engineers can run immediately without a trained model.
"""
from pathlib import Path
from typing import List, Sequence

from app.models.temporal_growth import BiomassRNN

# Default model path (project root / models/)
_MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "temporal_v1.pt"


def _load_model():
    """Load BiomassRNN weights if available."""
    try:
        import torch
    except ImportError:
        return None
    if _MODEL_PATH.exists():
        model = BiomassRNN()
        model.load_state_dict(torch.load(_MODEL_PATH, map_location="cpu"))
        model.eval()
        return model
    return None


def _heuristic_forecast(sequence: Sequence) -> float:
    """
    Fallback when no trained model: simple growth curve.
    Uses last biomass + avg daily growth - grazing penalty.
    """
    if not sequence:
        return 2.0
    last = sequence[-1]
    if isinstance(last, dict):
        biomass = last.get("biomass_t_ha", last[0] if isinstance(last, (list, tuple)) else 2.0)
        grazing = last.get("grazing_pressure", 0.1)
        rainfall = last.get("rainfall_mm", 5.0)
    else:
        biomass = float(last[0]) if isinstance(last, (list, tuple)) else float(last)
        grazing = 0.1
        rainfall = 5.0
    daily_growth = 0.008 + rainfall / 2000
    penalty = grazing * 0.15
    return round(max(biomass + daily_growth - penalty, 0.4), 3)


def predict_growth(sequence: List) -> float:
    """
    Predict next-day biomass from past sequence.
    sequence: list of dicts {biomass_t_ha, rainfall_mm, temperature_c, grazing_pressure}
              or list of [biomass, rainfall, temp, grazing] lists.
    Returns: predicted biomass (t/ha) for next day.
    """
    try:
        import torch
    except ImportError:
        return _heuristic_forecast(sequence)

    model = _load_model()
    if model is None:
        return _heuristic_forecast(sequence)

    # Build feature matrix [T, 4]
    rows = []
    for pt in sequence:
        if isinstance(pt, dict):
            rows.append([
                pt["biomass_t_ha"],
                pt["rainfall_mm"],
                pt["temperature_c"],
                pt["grazing_pressure"],
            ])
        elif isinstance(pt, (list, tuple)) and len(pt) >= 4:
            rows.append([float(pt[0]), float(pt[1]), float(pt[2]), float(pt[3])])
        else:
            continue
    if not rows:
        return _heuristic_forecast(sequence)

    import torch
    x = torch.tensor(rows, dtype=torch.float32).unsqueeze(0)  # [1, T, 4]
    with torch.no_grad():
        next_biomass = model(x)
    return round(float(next_biomass.item()), 3)
