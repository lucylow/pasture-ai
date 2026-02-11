# app/monitoring/drift.py
"""
Model drift metrics for PastureAI.
Without drift monitoring, models silently rot.
"""
from typing import Dict, Any

import numpy as np


def population_drift(reference: np.ndarray, current: np.ndarray) -> float:
    """
    Mean absolute difference between reference and current population means.
    Use for high-level drift signal.
    """
    ref_mean = reference.mean(axis=0)
    cur_mean = current.mean(axis=0)
    return float(np.mean(np.abs(ref_mean - cur_mean)))


def feature_drift(
    ref: Dict[str, float],
    cur: Dict[str, float],
    threshold: float = 0.15,
) -> Dict[str, Dict[str, Any]]:
    """
    Per-feature drift: delta and alert flag.
    ref/cur: dicts of feature_name -> aggregate value (e.g. mean).
    threshold: alert when |ref - cur| > threshold.
    """
    drift = {}
    for k in ref:
        cur_val = cur.get(k, ref[k])
        delta = abs(float(ref[k]) - float(cur_val))
        drift[k] = {
            "delta": round(delta, 4),
            "alert": delta > threshold,
        }
    return drift
