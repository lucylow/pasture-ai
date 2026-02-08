# app/sustainability/planner.py
"""
Rotational grazing planner.


Inputs:
- paddocks: list of dicts {id, area_ha, current_biomass_g_m2}
- animals: list of dicts {id, daily_intake_kg} or total_animal_units
- parameters: rest_days_required, planning_horizon_days


Output:
- schedule: mapping day -> list of allocations {paddock_id, grazing_days, animals_assigned}
"""


from typing import List, Dict
import math
from datetime import date, timedelta
from copy import deepcopy


# default assumptions
DEFAULT_DRY_MATTER_INTAKE_PER_AU_kg_per_day = 10.0  # an example animal unit (AU) consumes 10 kg DM/day


def compute_available_biomass_kg(paddock_area_ha: float, biomass_g_m2: float) -> float:
    """
    Compute available dry biomass (kg) on a paddock.
    area_ha -> m2 = ha * 10,000
    biomass_g_m2 -> grams per m2
    """
    area_m2 = paddock_area_ha * 10000.0
    total_kg = (biomass_g_m2 * area_m2) / 1000.0
    return total_kg


def plan_rotational_grazing(paddocks: List[Dict],
                            total_animal_units: float,
                            intake_per_au_kg_per_day: float = DEFAULT_DRY_MATTER_INTAKE_PER_AU_kg_per_day,
                            rest_days_required: int = 21,
                            planning_horizon_days: int = 90) -> Dict:
    """
    Very practical greedy planner:
    - estimate total daily forage demand = total_AU * intake_per_au
    - iterate days 0..horizon:
      - pick a paddock not rested recently, with highest available biomass per ha
      - assign animals for a given grazing period (few days) until paddock's available biomass is reduced to a safe residual (e.g., 20% of starting)
      - mark paddock as entering rest and track rest cooldown


    Returns:
      dict { 'start_date': date, 'horizon_days': N, 'allocations': [ {day, paddock_id, au_assigned, grazing_days, biomass_consumed_kg} ... ] }
    """
    # deep copy paddocks and compute initial available_kg and residual target
    padds = deepcopy(paddocks)
    for p in padds:
        p.setdefault('biomass_g_m2', 200.0)  # fallback
        p.setdefault('area_ha', 1.0)
        p['available_kg'] = compute_available_biomass_kg(p['area_ha'], p['biomass_g_m2'])
        p['initial_kg'] = p['available_kg']
        p['rest_until_day'] = -1  # day index until which paddock is in rest
    daily_demand_kg = total_animal_units * intake_per_au_kg_per_day
    allocations = []


    for day in range(planning_horizon_days):
        # selectable paddocks: those not in rest and with available_kg > threshold
        selectable = [p for p in padds if p['rest_until_day'] < day and p['available_kg'] > 0.01 * p['initial_kg']]
        if not selectable:
            # nothing available -> skip day
            allocations.append({'day': day, 'action': 'no_available_paddock'})
            continue
        # pick paddock with highest biomass density per ha
        selectable.sort(key=lambda x: (x['available_kg'] / x['area_ha']), reverse=True)
        p = selectable[0]
        # decide grazing days: consume until reaching residual target (e.g., leave 25% of initial kg)
        residual_target_kg = 0.25 * p['initial_kg']
        consumable_kg = max(0.0, p['available_kg'] - residual_target_kg)
        if consumable_kg <= 0:
            # mark rest and continue
            p['rest_until_day'] = day + rest_days_required
            allocations.append({'day': day, 'paddock_id': p['id'], 'action': 'set_rest'})
            continue
        # days required to consume consumable_kg given daily demand
        days_needed = math.ceil(consumable_kg / daily_demand_kg) if daily_demand_kg > 0 else 0
        days_assigned = min(days_needed, planning_horizon_days - day)
        # consume forage over days_assigned
        consumed_kg = min(consumable_kg, days_assigned * daily_demand_kg)
        p['available_kg'] -= consumed_kg
        # mark rest period after grazing
        p['rest_until_day'] = day + days_assigned + rest_days_required
        allocations.append({
            'day': day,
            'paddock_id': p['id'],
            'au_assigned': total_animal_units,
            'grazing_days': days_assigned,
            'biomass_consumed_kg': consumed_kg,
            'remaining_kg': p['available_kg']
        })
        # skip forward the day pointer by days_assigned-1 (loop will increment by 1)
        # We'll simulate day by day for clarity; in more advanced planner you can jump days
    return {
        'horizon_days': planning_horizon_days,
        'daily_demand_kg': daily_demand_kg,
        'allocations': allocations,
        'paddock_summary': [{ 'id': p['id'], 'initial_kg': p['initial_kg'], 'remaining_kg': p['available_kg']} for p in padds]
    }
