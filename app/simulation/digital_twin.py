# app/simulation/digital_twin.py
"""
Digital twin playback: timeline of pasture states + grazing events for demos.
Frontend animates over frames to show "what happened" over a planning horizon.
"""
from datetime import date, timedelta
from typing import Any, Dict, List, Optional

from app.mock.pastures import mock_pastures
from app.mock.temporal_data import generate_mock_timeseries
from app.pipelines.optimizer import optimize_grazing


def build_playback_timeline(
    pasture_ids: Optional[List[str]] = None,
    start_date: Optional[date] = None,
    horizon_days: int = 90,
    herd_demand_tonnes: float = 35.0,
) -> Dict[str, Any]:
    """
    Build a digital twin timeline: day-by-day pasture states and grazing events.
    Returns frames suitable for UI playback/animations.

    Returns:
        {
            "start_date": "2026-02-11",
            "horizon_days": 90,
            "frames": [
                {
                    "day": 0,
                    "date": "2026-02-11",
                    "pastures": {pasture_id: {biomass, area, status, ...}},
                    "events": [{type, pasture_id, graze_tonnes, ...}],
                    "carbon_state": {...},
                },
                ...
            ],
            "plan_summary": [...]
        }
    """
    start_date = start_date or date.today()
    pastures = mock_pastures()
    if pasture_ids:
        pastures = [p for p in pastures if p.id in pasture_ids]
    if not pastures:
        pastures = mock_pastures()

    # Get grazing plan
    plan = optimize_grazing(pastures, herd_demand_tonnes, horizon_days)
    plan_by_pasture: Dict[str, Dict] = {p.id: {} for p in pastures}
    for item in plan:
        pid = item.get("pasture_id", "")
        if pid:
            plan_by_pasture[pid] = item

    # Build day 0 biomass from mock timeseries
    biomass_by_pasture: Dict[str, float] = {}
    for p in pastures:
        ts = generate_mock_timeseries(p.id, days=90, seed=hash(p.id) % 1000)
        if ts.get("history"):
            last = ts["history"][-1]
            biomass_by_pasture[p.id] = last.get("biomass_t_ha", p.biomass)
        else:
            biomass_by_pasture[p.id] = p.biomass

    frames = []
    daily_growth = 0.06
    rest_until_day: Dict[str, int] = {}
    last_graze_day: Dict[str, int] = {}

    for day in range(horizon_days):
        d = start_date + timedelta(days=day)
        frame = {
            "day": day,
            "date": d.isoformat(),
            "pastures": {},
            "events": [],
            "carbon_state": {
                "soil_carbon_t_ha": round(85.0 + day * 0.01, 2),
                "annual_change_t_ha": 0.12,
                "ground_cover": round(0.9 - day / horizon_days * 0.05, 2),
            },
        }

        for p in pastures:
            pid = p.id
            bio = biomass_by_pasture.get(pid, p.biomass)
            in_rest = rest_until_day.get(pid, -1) >= day

            # Apply growth if not in rest
            if not in_rest:
                bio = min(bio + daily_growth, 6.0)

            # Grazing event: cycle through plan items every ~21 days
            plan_item = plan_by_pasture.get(pid, {})
            graze_now = (
                plan_item.get("graze_tonnes", 0) > 0
                and not in_rest
                and (day - last_graze_day.get(pid, -21)) >= 21
            )
            if graze_now:
                graze = plan_item.get("graze_tonnes", 0)
                consumed = min(graze, bio * p.area * 0.35)
                bio = max(0.4, bio - consumed / (p.area or 1))
                biomass_by_pasture[pid] = bio
                rest_until_day[pid] = day + plan_item.get("recovery_days", 21)
                last_graze_day[pid] = day
                frame["events"].append({
                    "type": "grazing",
                    "pasture_id": pid,
                    "graze_tonnes": round(consumed, 2),
                    "recovery_days": plan_item.get("recovery_days", 21),
                })

            biomass_by_pasture[pid] = bio
            frame["pastures"][pid] = {
                "biomass_t_ha": round(bio, 2),
                "area_ha": p.area,
                "status": "resting" if rest_until_day.get(pid, -1) >= day else "available",
                "recovery_days_left": max(0, rest_until_day.get(pid, 0) - day),
            }

        frames.append(frame)

    return {
        "start_date": start_date.isoformat(),
        "horizon_days": horizon_days,
        "herd_demand_tonnes": herd_demand_tonnes,
        "frames": frames,
        "plan_summary": plan,
    }
