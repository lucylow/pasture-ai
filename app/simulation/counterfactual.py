# app/simulation/counterfactual.py
"""
Counterfactual simulation: "What if we graze later?"
Farmer trust and advisory workflows. Decision intelligence, not AI magic.
"""
from datetime import date, timedelta
from typing import Any, Dict, List

from app.mock.temporal_data import generate_mock_timeseries
from app.pipelines.temporal_forecast import forecast_with_uncertainty_auto


def _extend_sequence_no_grazing(
    sequence: List[Dict],
    days: int,
    daily_growth: float = 0.06,
) -> List[Dict]:
    """
    Extend a temporal sequence by projecting growth without grazing.
    Used for "what if we wait N days" counterfactual.
    """
    if not sequence:
        return sequence
    last = sequence[-1]
    extended = list(sequence)
    biomass = last.get("biomass_t_ha", 2.5)
    base_date = last.get("date", date.today().isoformat())
    if isinstance(base_date, str):
        base_date = date.fromisoformat(base_date)

    for i in range(1, days + 1):
        biomass = min(biomass + daily_growth, 6.0)  # cap at 6 t/ha
        extended.append({
            "date": (base_date + timedelta(days=i)).isoformat(),
            "biomass_t_ha": round(biomass, 2),
            "rainfall_mm": 5.0,
            "temperature_c": 18.0,
            "grazing_pressure": 0.0,
        })
    return extended


def simulate_graze_delay(
    pasture: Any,
    current_date: date | None = None,
    delay_days: int = 7,
    growth_model: Any = None,
    timeseries: Dict | None = None,
) -> Dict[str, Any]:
    """
    Simulate "what if we graze N days later?"
    Returns baseline vs delayed biomass, delta, and risk change.

    Args:
        pasture: Object with id, biomass, recovery_rate, or pasture_id.
        current_date: Reference date (default: today).
        delay_days: Days to delay grazing.
        growth_model: Optional; uses forecast_with_uncertainty_auto if None.
        timeseries: Optional precomputed {pasture_id, history}; generated if None.
    """
    current_date = current_date or date.today()

    # Resolve pasture id and base biomass
    pasture_id = getattr(pasture, "id", None) or getattr(pasture, "pasture_id", None) or "P1"
    base_biomass = getattr(pasture, "biomass", 2.8)
    recovery = getattr(pasture, "recovery_rate", 0.06)

    # Get or generate timeseries
    if timeseries and timeseries.get("history"):
        history = timeseries["history"]
    else:
        ts = generate_mock_timeseries(pasture_id, days=90, seed=hash(pasture_id) % 1000)
        history = ts["history"]

    # Baseline: forecast at current_date (use last ~30 days of history)
    seq_baseline = [h for h in history if h.get("date", "") <= current_date.isoformat()]
    if not seq_baseline:
        seq_baseline = history[-30:] if len(history) >= 30 else history

    forecast_fn = growth_model or forecast_with_uncertainty_auto
    baseline = forecast_fn(seq_baseline)

    # Delayed: extend sequence by delay_days (no grazing), then forecast
    daily_growth = recovery if hasattr(recovery, "__float__") else 0.06
    seq_delayed = _extend_sequence_no_grazing(seq_baseline, delay_days, daily_growth)
    delayed = forecast_fn(seq_delayed[-30:] if len(seq_delayed) >= 30 else seq_delayed)

    # Ensure we have mean and std
    baseline_mean = baseline.get("mean", base_biomass)
    baseline_std = baseline.get("std", 0.18)
    delayed_mean = delayed.get("mean", baseline_mean + 0.4)
    delayed_std = delayed.get("std", 0.25)

    delta = delayed_mean - baseline_mean

    return {
        "delay_days": delay_days,
        "baseline_biomass": baseline,
        "delayed_biomass": delayed,
        "biomass_change_t_ha": round(delta, 2),
        "risk_change": {
            "baseline_std": baseline_std,
            "delayed_std": delayed_std,
        },
    }
