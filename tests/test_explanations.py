# tests/test_explanations.py
"""Tests for farmer-facing explanation generation."""
import pytest

from app.explanations.generator import (
    explain_grazing_decision,
    explain_counterfactual,
    explain_carbon_impact,
)


def test_explain_grazing_empty_plan():
    """Empty plan gets helpful message."""
    out = explain_grazing_decision([], herd_demand_tonnes=35)
    assert "No pastures" in out["summary"]
    assert "rationale" in out
    assert "next_steps" in out


def test_explain_grazing_single_pasture():
    """Single pasture plan gets actionable summary."""
    plan = [
        {"pasture_id": "P1", "graze_tonnes": 12.5, "recovery_days": 28},
    ]
    out = explain_grazing_decision(plan, herd_demand_tonnes=35)
    assert "P1" in out["summary"]
    assert "12.5" in out["summary"]
    assert "28" in out["rationale"]


def test_explain_counterfactual():
    """Counterfactual explanation includes biomass and risk."""
    result = {
        "delay_days": 7,
        "biomass_change_t_ha": 0.42,
        "risk_change": {"baseline_std": 0.18, "delayed_std": 0.25},
    }
    out = explain_counterfactual(result)
    assert "7" in out["summary"]
    assert "0.42" in out["summary"]
    assert "interpretation" in out


def test_explain_carbon_positive():
    """Positive carbon gets sequestration message."""
    state = {"annual_change_t_ha": 0.38, "ground_cover": 0.91}
    out = explain_carbon_impact(state)
    assert "building" in out["summary"] or "0.38" in out["summary"]
    assert "soil" in out["soil_health_note"]


def test_explain_carbon_with_credits():
    """Carbon with credit estimate gets credits explanation."""
    state = {"annual_change_t_ha": 0.35, "ground_cover": 0.92}
    credits = {
        "eligible_credits_tco2e": 12.5,
        "eligibility": {"issues": []},
    }
    out = explain_carbon_impact(state, credit_estimate=credits)
    assert "12.5" in out["credits_explanation"] or "tCO2e" in out["credits_explanation"]
