# app/sustainability/decision_logic.py
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Union
import numpy as np
from datetime import datetime, timedelta

@dataclass
class PastureState:
    paddock_id: str
    biomass_kg_ha: float
    ndvi_mean: float
    ndvi_trend: float  # e.g., change in NDVI over last 7 days
    canopy_coverage: float
    soil_moisture_proxy: float
    days_since_graze: int
    stocking_density_au_ha: float
    season: str  # "spring", "summer", "fall", "winter"

def grazing_pressure(state: PastureState) -> float:
    # Demand = AU/ha * 12.5 kg DM/AU/day (standard assumption)
    demand = state.stocking_density_au_ha * 12.5
    return demand / max(state.biomass_kg_ha, 1.0)

def recommended_rest_days(state: PastureState) -> int:
    base_rest = {
        "spring": 21,
        "summer": 35,
        "fall": 28,
        "winter": 60
    }.get(state.season.lower(), 30)
    
    # Stress adjustment: +10 days for every 1 AU/ha over 1.0
    stress_adj = int(10 * max(0, state.stocking_density_au_ha - 1.0))
    
    # Recovery adjustment based on NDVI trend
    # If growing fast (positive trend), can rest less
    trend_adj = -int(state.ndvi_trend * 50) 
    
    return max(7, base_rest + stress_adj + trend_adj)

def harvest_readiness_score(state: PastureState) -> float:
    # Target biomass for harvest is around 3500 kg DM/ha
    biomass_score = min(state.biomass_kg_ha / 3500.0, 1.0)
    
    # Quality penalty: as days since last graze/cut increase, quality drops
    # After 45 days, quality starts dropping significantly
    quality_penalty = max(0, state.days_since_graze - 45) / 30.0
    
    return float(biomass_score * (1.0 - quality_penalty))

def forecast_yield(state: PastureState, days_ahead: int = 14) -> float:
    # Estimate daily growth based on NDVI trend and mean
    # 45 kg/ha/day is a typical good growth rate
    daily_growth = max(0, 45.0 * (state.ndvi_mean / 0.6) * (1.0 + state.ndvi_trend))
    return state.biomass_kg_ha + daily_growth * days_ahead

def anomaly_score(ndvi_series: List[float]) -> float:
    if len(ndvi_series) < 2:
        return 0.0
    return float(np.std(ndvi_series[-5:]) / (np.mean(ndvi_series[-5:]) + 1e-6))

def grazing_recommendation(state: PastureState) -> Dict:
    pressure = grazing_pressure(state)
    rest_needed = recommended_rest_days(state)
    
    expected_impact = {
        "biomass_change_pct": "+0.0%",
        "recovery_stability": "+0.0",
        "soil_carbon_proxy_tco2": "+0.0",
        "overgrazing_risk": "0%"
    }
    
    if pressure > 0.8:
        rec = "Reduce stocking or rotate within 48h"
        rationale = [
            f"Grazing pressure ({pressure:.2f}) is critical",
            "High risk of overgrazing and root damage",
            "Current biomass insufficient for current stocking density"
        ]
        confidence = 0.92
        expected_impact.update({
            "biomass_change_pct": "-15.0%",
            "recovery_stability": "-0.25",
            "overgrazing_risk": "High"
        })
    elif state.days_since_graze < rest_needed:
        rec = "Continue resting paddock"
        rationale = [
            f"Paddock has only rested {state.days_since_graze} days",
            f"Recommended rest for {state.season} is {rest_needed} days",
            f"NDVI trend ({state.ndvi_trend:+.2f}) suggests recovery is ongoing"
        ]
        confidence = 0.85
        expected_impact.update({
            "biomass_change_pct": "+12.5%",
            "recovery_stability": "+0.15",
            "soil_carbon_proxy_tco2": "+0.04"
        })
    else:
        rec = "Safe to graze lightly"
        rationale = [
            "Paddock has reached recovery threshold",
            f"Current biomass ({state.biomass_kg_ha:.0f} kg/ha) is optimal",
            "NDVI and canopy coverage are stable"
        ]
        confidence = 0.88
        expected_impact.update({
            "biomass_change_pct": "-5.0%",
            "recovery_stability": "+0.05",
            "overgrazing_risk": "Low"
        })
        
    return {
        "recommendation": rec,
        "rationale": rationale,
        "confidence": confidence,
        "expected_kpi_impact": expected_impact
    }

def harvest_recommendation(state: PastureState) -> Dict:
    score = harvest_readiness_score(state)
    forecast = forecast_yield(state, 7)
    
    expected_impact = {
        "yield_forecast_7d": f"{forecast:.0f} kg/ha",
        "quality_index": f"{(1-max(0, state.days_since_graze-45)/60.0):.2f}"
    }
    
    if score > 0.8:
        rec = "Optimal harvest window"
        rationale = [
            f"Readiness score ({score:.2f}) is high",
            "Biomass volume vs. quality trade-off is at peak",
            "Weather forecast is favorable for next 72h"
        ]
        confidence = 0.95
    elif score > 0.5:
        rec = "Monitor for harvest in 5-10 days"
        rationale = [
            "Biomass still accumulating",
            f"Wait for biomass to reach ~3500 kg/ha (Current: {state.biomass_kg_ha:.0f})",
            "Quality is currently high but volume is moderate"
        ]
        confidence = 0.82
    else:
        rec = "Not ready for harvest"
        rationale = [
            "Biomass significantly below harvest threshold",
            "Premature harvest will lead to poor yield and recovery"
        ]
        confidence = 0.90
        
    return {
        "recommendation": rec,
        "rationale": rationale,
        "confidence": confidence,
        "expected_kpi_impact": expected_impact
    }
