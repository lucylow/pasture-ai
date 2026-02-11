# app/mock/temporal_forecast.py
"""
Mock temporal forecast output with uncertainty bands.
Feeds UI uncertainty ribbons and risk-aware optimization.
"""
from datetime import date, timedelta
from typing import Optional


def mock_temporal_forecast_with_uncertainty(
    pasture_id: str = "P1",
    forecast_date: Optional[date] = None,
) -> dict:
    """
    Returns mock forecast with mean, lower, upper, std.
    Matches format expected by UI uncertainty ribbons.
    """
    fd = forecast_date or (date.today() + timedelta(days=1))
    return {
        "pasture_id": pasture_id,
        "forecast_date": fd.isoformat(),
        "biomass_t_ha": {
            "mean": 3.42,
            "lower": 3.05,
            "upper": 3.78,
            "std": 0.19,
        },
    }
