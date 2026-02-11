# app/pipelines/optimizer.py
"""
Multi-pasture grazing optimization solver.
Operations research: meet herd demand, avoid overgrazing, maximize recovery + carbon.
Directly usable in frontend optimizer UI.
"""
from typing import List, Any

from app.models.carbon import estimate_carbon_change


def optimize_grazing(
    pastures: List[Any],
    herd_demand_tonnes: float,
    horizon_days: int,
) -> List[dict]:
    """
    Greedy optimizer: prioritize high biomass, low soil sensitivity.
    Returns grazing plan with pasture_id, graze_tonnes, recovery_days, carbon_impact.
    """
    plan = []
    remaining = herd_demand_tonnes

    sorted_pastures = sorted(
        pastures,
        key=lambda p: (-p.biomass, p.soil_sensitivity),
    )

    for p in sorted_pastures:
        if remaining <= 0:
            break

        available = p.biomass * p.area * 0.4
        graze = min(available, remaining)

        recovery_days = int(graze / (p.recovery_rate * p.area) * 1.2)
        grazing_pressure = graze / available if available > 0 else 0

        plan.append({
            "pasture_id": p.id,
            "graze_tonnes": round(graze, 2),
            "recovery_days": recovery_days,
            "carbon_impact": estimate_carbon_change(
                biomass_delta_t_ha=p.recovery_rate * recovery_days,
                grazing_pressure=grazing_pressure,
                soil_sensitivity=p.soil_sensitivity,
            ),
        })

        remaining -= graze

    return plan
