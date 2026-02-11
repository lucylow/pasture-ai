# app/monitoring/monitor.py
"""
Drift monitor service: trigger retraining, warning banner, or model card update.
"""
from typing import Dict, Any

from app.monitoring.drift import feature_drift


def monitor_model_drift(
    reference_stats: Dict[str, float],
    live_stats: Dict[str, float],
    threshold: float = 0.15,
) -> Dict[str, Any]:
    """
    Compare reference (baseline) stats to live stats.
    Returns drift_detected and list of alerts.
    """
    drift = feature_drift(reference_stats, live_stats, threshold=threshold)
    alerts = {k: v for k, v in drift.items() if v["alert"]}

    return {
        "drift_detected": len(alerts) > 0,
        "alerts": alerts,
        "all_drift": drift,
    }
