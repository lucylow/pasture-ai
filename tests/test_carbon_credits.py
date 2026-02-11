# tests/test_carbon_credits.py
"""Tests for carbon credit calculation."""
import pytest

from app.carbon.credits import (
    calculate_carbon_credits,
    estimate_credits_from_carbon_state,
    tc_to_co2e,
    check_eligibility,
)


def test_tc_to_co2e():
    """C to CO2e conversion uses 44/12 ratio."""
    assert abs(tc_to_co2e(1.0) - 3.6667) < 0.01


def test_calculate_carbon_credits():
    """Credits computed with buffer and eligibility."""
    est = calculate_carbon_credits(
        soil_carbon_change_tc_ha_yr=0.35,
        area_ha=100,
        ground_cover=0.91,
        methodology="generic",
    )
    assert est.co2e_t_yr > 0
    assert est.eligible_credits_tco2e > 0
    assert est.eligibility.ground_cover_ok is True
    assert est.eligibility.baseline_met is True


def test_eligibility_low_ground_cover():
    """Low ground cover zeros eligible credits."""
    est = calculate_carbon_credits(
        soil_carbon_change_tc_ha_yr=0.2,
        area_ha=50,
        ground_cover=0.50,
    )
    assert est.eligibility.ground_cover_ok is False
    assert est.eligible_credits_tco2e == 0.0


def test_credits_from_carbon_state():
    """Credits from API carbon_state dict."""
    state = {
        "soil_carbon_t_ha": 42.5,
        "annual_change_t_ha": 0.38,
        "ground_cover": 0.91,
    }
    est = estimate_credits_from_carbon_state(state, area_ha=120)
    assert est.eligible_credits_tco2e > 0
