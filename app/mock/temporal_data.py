# app/mock/temporal_data.py
"""
Mock temporal time-series data for PastureAI.
Mirrors real pasture dynamics: regrowth + grazing events.
Engineers can run immediately without live data.
"""
from datetime import date, timedelta
import random


def generate_mock_timeseries(pasture_id: str = "P1", days: int = 90, seed=None) -> dict:
    if seed is not None:
        random.seed(seed)
    base = 2.2
    history = []
    today = date.today()

    for i in range(days):
        biomass = base + 0.01 * i - random.uniform(0, 0.15)
        rainfall = random.uniform(0, 12)
        grazing = 0.3 if i % 21 < 5 else 0.05

        history.append({
            "date": (today - timedelta(days=days - i)).isoformat(),
            "biomass_t_ha": round(max(biomass - grazing, 0.4), 2),
            "rainfall_mm": round(rainfall, 1),
            "temperature_c": round(random.uniform(12, 28), 1),
            "grazing_pressure": grazing,
        })

    return {
        "pasture_id": pasture_id,
        "history": history,
    }
