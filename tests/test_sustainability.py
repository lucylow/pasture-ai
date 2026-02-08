# tests/test_sustainability.py
import pytest
from app.sustainability import utils as s_utils
import numpy as np


def test_biomass_to_co2e():
    # Example: 100 g/m2 over 1 ha (10,000 m2) => 1000 kg biomass -> carbon 450 kg -> CO2e 1650 kg
    res = s_utils.biomass_and_area_to_co2e(100.0, 10000.0)
    assert round(res['biomass_kg'], 3) == 1000.0
    assert round(res['carbon_kg'], 3) == 450.0
    assert round(res['co2e_kg'], 3) == 1650.0


def test_estimate_annual_sequestration_rate():
    prev = 100.0
    cur = 130.0
    area = 10000.0
    res = s_utils.estimate_annual_sequestration_rate(prev, cur, area, interval_days=90)
    assert res['delta_biomass_g_m2'] == 30.0
    assert res['delta_biomass_kg'] == 30.0 * 10000.0 / 1000.0  # 300 kg increase
    assert res['delta_carbon_kg'] == pytest.approx((res['delta_biomass_kg'] * 0.45))
    assert res['annualized_co2e_kg_per_year'] is not None


def test_biodiversity_proxy_from_array():
    arr = np.zeros((128,128,3), dtype=np.uint8)
    arr[0:32,0:32,:] = [0,255,0]
    score = s_utils.biodiversity_proxy_from_image_array(arr)
    assert 0.0 <= score <= 1.0
