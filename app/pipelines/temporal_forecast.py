# app/pipelines/temporal_forecast.py
"""
Temporal forecast with uncertainty bands.
Outputs mean, lower/upper bounds, and std for risk-aware decisions.
"""
import math
from pathlib import Path
from typing import Any, List, Sequence

_MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "temporal_uncertainty_v1.pt"


def _load_uncertainty_model():
    """Load BiomassRNNUncertainty weights if available."""
    try:
        import torch
        from app.models.temporal_growth_uncertainty import BiomassRNNUncertainty
    except ImportError:
        return None
    if _MODEL_PATH.exists():
        model = BiomassRNNUncertainty()
        model.load_state_dict(torch.load(_MODEL_PATH, map_location="cpu"))
        model.eval()
        return model
    return None


def _build_sequence_tensor(sequence: Sequence) -> tuple[Any, bool]:
    """Build [1, T, 4] tensor from sequence. Returns (tensor, ok)."""
    try:
        import torch
    except ImportError:
        return None, False

    rows = []
    for pt in sequence:
        if isinstance(pt, dict):
            rows.append([
                pt.get("biomass_t_ha", 2.0),
                pt.get("rainfall_mm", 5.0),
                pt.get("temperature_c", 15.0),
                pt.get("grazing_pressure", 0.1),
            ])
        elif isinstance(pt, (list, tuple)) and len(pt) >= 4:
            rows.append([float(pt[0]), float(pt[1]), float(pt[2]), float(pt[3])])
        else:
            continue
    if not rows:
        return None, False

    x = torch.tensor(rows, dtype=torch.float32).unsqueeze(0)
    return x, True


def _heuristic_uncertainty(sequence: Sequence, z: float = 1.96) -> dict:
    """Fallback when no trained model: point estimate + heuristic std."""
    from app.pipelines.temporal_inference import predict_growth

    mean = predict_growth(list(sequence))
    # Heuristic: ±10% of mean as rough uncertainty
    sigma = max(0.08, mean * 0.10)
    return {
        "mean": round(mean, 2),
        "lower": round(mean - z * sigma, 2),
        "upper": round(mean + z * sigma, 2),
        "std": round(sigma, 2),
    }


def forecast_with_uncertainty(
    model: Any,
    sequence: List,
    z: float = 1.96,
) -> dict:
    """
    Produce biomass forecast with confidence bands.
    z=1.96 → ~95% confidence interval.

    Returns:
        {
            "mean": float,
            "lower": float,
            "upper": float,
            "std": float,
        }
    """
    x, ok = _build_sequence_tensor(sequence)
    if not ok or x is None:
        return _heuristic_uncertainty(sequence, z)

    import torch

    with torch.no_grad():
        mean, logvar = model(x)

    mu = mean.item()
    sigma = math.sqrt(torch.exp(logvar).item())

    return {
        "mean": round(mu, 2),
        "lower": round(mu - z * sigma, 2),
        "upper": round(mu + z * sigma, 2),
        "std": round(sigma, 2),
    }


def forecast_with_uncertainty_auto(sequence: List, z: float = 1.96) -> dict:
    """
    Forecast using trained BiomassRNNUncertainty if available,
    otherwise heuristic uncertainty.
    """
    model = _load_uncertainty_model()
    if model is None:
        return _heuristic_uncertainty(sequence, z)
    return forecast_with_uncertainty(model, sequence, z)
