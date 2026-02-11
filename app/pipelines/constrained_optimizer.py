# app/pipelines/constrained_optimizer.py
"""
Constraint-aware grazing optimization.
Considers water, fencing, labor, and recovery rules for operations-grade planning.
"""
from typing import Any, Dict, List

from app.schemas.constraints import FarmConstraints, PastureOperationalState


def _get_or_default(d: dict, key: str, default: Any) -> Any:
    return d.get(key, default) if isinstance(d, dict) else default


def optimize_with_constraints(
    pastures: List[Dict],
    operations: List[Dict],
    constraints: FarmConstraints,
    herd_demand_tonnes: float,
    utilization_factor: float = 0.35,
) -> dict:
    """
    Produce grazing plan respecting water, labor, fence, and recovery constraints.

    Args:
        pastures: list of dicts with id, biomass (t/ha), area (ha), recovery_rate (t/ha/day)
        operations: list of dicts with pasture_id, water_requirement, labor_hours, fence_units
        constraints: FarmConstraints instance
        herd_demand_tonnes: total herd demand (tonnes)
        utilization_factor: fraction of available biomass that can be grazed (default 0.35)

    Returns:
        {
            "plan": [{pasture_id, graze_tonnes, recovery_days, constraints_ok}, ...],
            "unmet_demand": float,
            "resources_remaining": {water_l, labor_hours, fence_units}
        }
    """
    plan = []
    remaining = herd_demand_tonnes

    water_left = constraints.available_water_l_per_day
    labor_left = constraints.max_daily_labor_hours
    fence_left = constraints.movable_fence_units

    # Build ops lookup by pasture_id
    ops_by_id: Dict[str, Dict] = {}
    for o in operations:
        pid = _get_or_default(o, "pasture_id", o.get("id", ""))
        if pid:
            ops_by_id[pid] = o

    # Sort by biomass descending (prefer high biomass pastures)
    sorted_pastures = sorted(
        pastures,
        key=lambda p: _get_or_default(p, "biomass", p.get("biomass_t_ha", 0)),
        reverse=True,
    )

    for pasture in sorted_pastures:
        if remaining <= 0:
            break

        pid = _get_or_default(pasture, "id", pasture.get("pasture_id", ""))
        if not pid:
            continue

        ops = ops_by_id.get(pid, {})

        water_req = float(ops.get("water_requirement_l_per_day", ops.get("water_requirement", 0)))
        labor_req = float(ops.get("labor_hours_per_move", ops.get("labor_hours", 0)))
        fence_req = int(ops.get("fence_units_required", ops.get("fence_units", 0)))

        # Constraint checks
        if water_req > water_left:
            continue
        if labor_req > labor_left:
            continue
        if fence_req > fence_left:
            continue

        biomass = float(_get_or_default(pasture, "biomass", pasture.get("biomass_t_ha", 2.0)))
        area = float(_get_or_default(pasture, "area", pasture.get("area_ha", 1.0)))
        recovery_rate = float(
            _get_or_default(pasture, "recovery_rate", pasture.get("recovery_rate_t_ha_day", 0.02))
        )

        available_tonnes = biomass * area * utilization_factor
        graze = min(available_tonnes, remaining)

        if graze <= 0:
            continue

        recovery_days = max(
            constraints.min_recovery_days,
            int(graze / (recovery_rate * area)) if recovery_rate * area > 0 else constraints.min_recovery_days,
        )

        plan.append({
            "pasture_id": pid,
            "graze_tonnes": round(graze, 2),
            "recovery_days": recovery_days,
            "constraints_ok": True,
        })

        remaining -= graze
        water_left -= water_req
        labor_left -= labor_req
        fence_left -= fence_req

    return {
        "plan": plan,
        "unmet_demand": round(remaining, 2),
        "resources_remaining": {
            "water_l": round(water_left, 1),
            "labor_hours": round(labor_left, 1),
            "fence_units": fence_left,
        },
    }
