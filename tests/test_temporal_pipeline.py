"""Tests for temporal, carbon, and optimization pipelines."""
import pytest
from app.mock.temporal_data import generate_mock_timeseries
from app.mock.carbon import mock_carbon_state
from app.mock.pastures import mock_pastures
from app.pipelines.temporal_inference import predict_growth
from app.pipelines.optimizer import optimize_grazing
from app.models.carbon import estimate_carbon_change


def test_generate_mock_timeseries():
    data = generate_mock_timeseries("P1", 30)
    assert data["pasture_id"] == "P1"
    assert len(data["history"]) == 30
    pt = data["history"][0]
    assert "date" in pt and "biomass_t_ha" in pt and "rainfall_mm" in pt
    assert "temperature_c" in pt and "grazing_pressure" in pt


def test_predict_growth_heuristic():
    seq = [
        {"biomass_t_ha": 2.5, "rainfall_mm": 8, "temperature_c": 20, "grazing_pressure": 0.1},
        {"biomass_t_ha": 2.6, "rainfall_mm": 5, "temperature_c": 22, "grazing_pressure": 0.05},
    ]
    pred = predict_growth(seq)
    assert isinstance(pred, float)
    assert pred >= 0.4
    assert pred < 10.0


def test_estimate_carbon_change():
    net = estimate_carbon_change(0.5, 0.3, 0.2)
    assert isinstance(net, float)
    # sequestration 0.5*0.45 - grazing 0.3*0.3 - soil 0.2*0.2
    assert -1 < net < 1


def test_mock_carbon_state():
    state = mock_carbon_state()
    assert "soil_carbon_t_ha" in state
    assert "annual_change_t_ha" in state
    assert state["confidence"] > 0


def test_mock_pastures():
    pastures = mock_pastures()
    assert len(pastures) == 4
    assert pastures[0].id == "P1"
    assert pastures[0].biomass > 0


def test_optimize_grazing():
    pastures = mock_pastures()
    plan = optimize_grazing(pastures, herd_demand_tonnes=35.0, horizon_days=90)
    assert isinstance(plan, list)
    assert len(plan) >= 1
    for p in plan:
        assert "pasture_id" in p
        assert "graze_tonnes" in p
        assert "recovery_days" in p
        assert "carbon_impact" in p
