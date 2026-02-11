# app/validation/report.py
"""
Validation report generator for model performance metrics.
Investor- and regulator-ready validation outputs.
"""
import numpy as np
from typing import List, Optional


def validation_report(
    y_true: np.ndarray,
    y_pred: np.ndarray,
) -> dict:
    """
    Generate validation metrics for biomass prediction models.

    Args:
        y_true: Ground truth values
        y_pred: Predicted values

    Returns:
        {
            "rmse": float,
            "mae": float,
            "bias": float,
            "p95_error": float
        }
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    errors = y_true - y_pred

    return {
        "rmse": float(np.sqrt(np.mean(errors**2))),
        "mae": float(np.mean(np.abs(errors))),
        "bias": float(np.mean(errors)),
        "p95_error": float(np.percentile(np.abs(errors), 95)),
    }


def temporal_validation_report(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    lower: Optional[np.ndarray] = None,
    upper: Optional[np.ndarray] = None,
    model_name: str = "TemporalGrowthRNN",
    forecast_horizon_days: int = 14,
    validated_on: Optional[str] = None,
    notes: str = "",
) -> dict:
    """
    Extended validation for temporal/forecast models with uncertainty bands.
    Computes coverage of 95% intervals if lower/upper provided.

    Returns:
        Model card-compatible validation output.
    """
    base = validation_report(y_true, y_pred)
    out = {
        "model": model_name,
        "forecast_horizon_days": forecast_horizon_days,
        "rmse": round(base["rmse"], 3),
        "mae": round(base["mae"], 3),
        "bias": round(base["bias"], 3),
        "p95_error": round(base["p95_error"], 3),
    }

    if lower is not None and upper is not None:
        lower = np.asarray(lower)
        upper = np.asarray(upper)
        coverage = np.mean((y_true >= lower) & (y_true <= upper))
        out["coverage_95pct"] = round(coverage, 2)

    if validated_on:
        out["validated_on"] = validated_on
    if notes:
        out["notes"] = notes

    return out
