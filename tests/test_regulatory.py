# tests/test_regulatory.py
"""Tests for regulatory capabilities: audit, counterfactual, exports, drift."""
import tempfile
from pathlib import Path

import pytest

from app.exports.csv_export import export_grazing_csv
from app.monitoring.drift import feature_drift, population_drift
from app.monitoring.monitor import monitor_model_drift
from app.services.audit_logger import log_decision
from app.simulation.counterfactual import simulate_graze_delay


def test_audit_log():
    """Audit logger writes to store and returns log."""
    log = log_decision(
        farm_id="F1",
        pasture_id="P1",
        decision_type="grazing",
        model_versions={"image2biomass": "v1.2"},
        inputs={"biomass_t_ha": 3.4},
        outputs={"graze_tonnes": 12.8},
        constraints={},
        user_id="test",
    )
    assert log["event_id"]
    assert log["farm_id"] == "F1"
    assert log["decision_type"] == "grazing"


def test_counterfactual_simulation():
    """Counterfactual returns baseline, delayed, and delta."""
    class Pasture:
        id = "P1"
        biomass = 2.9
        recovery_rate = 0.07

    result = simulate_graze_delay(Pasture(), delay_days=7)
    assert "delay_days" in result
    assert result["delay_days"] == 7
    assert "biomass_change_t_ha" in result
    assert "baseline_biomass" in result
    assert "delayed_biomass" in result
    assert "risk_change" in result


def test_csv_export():
    """CSV export writes decisions to file."""
    decisions = [
        {
            "date": "2026-01-15",
            "pasture_id": "P1",
            "biomass_before": 3.2,
            "biomass_after": 2.1,
            "graze_tonnes": 12.5,
            "recovery_days": 28,
            "carbon_delta": 0.3,
        },
    ]
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as f:
        path = export_grazing_csv(decisions, f.name)
    assert path.exists()
    content = path.read_text()
    assert "date" in content
    assert "P1" in content


def test_population_drift():
    """Population drift returns scalar."""
    import numpy as np

    ref = np.random.randn(100, 4)
    cur = ref + 0.1
    d = population_drift(ref, cur)
    assert d >= 0


def test_feature_drift():
    """Feature drift returns per-feature delta and alert."""
    ref = {"ndvi_mean": 0.65, "biomass_mean": 3.2}
    cur = {"ndvi_mean": 0.86, "biomass_mean": 3.2}
    drift = feature_drift(ref, cur, threshold=0.15)
    assert drift["ndvi_mean"]["alert"] is True
    assert drift["biomass_mean"]["alert"] is False


def test_monitor_model_drift():
    """Monitor returns drift_detected and alerts."""
    ref = {"ndvi_mean": 0.65}
    live = {"ndvi_mean": 0.90}
    out = monitor_model_drift(ref, live, threshold=0.15)
    assert out["drift_detected"] is True
    assert "ndvi_mean" in out["alerts"]
