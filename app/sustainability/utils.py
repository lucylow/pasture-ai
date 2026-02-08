# app/sustainability/utils.py
"""
Sustainability estimation utilities.


Key concepts / formulas:
- dry_biomass_g_m2: grams of dry biomass per square meter (measured/estimated)
- carbon fraction: fraction of dry biomass stored as carbon (typical ~0.45 for plant biomass)
- convert C to CO2e: multiply kg C by (44/12) = 3.6666666666666665


Example: 100 g/m2 over 1 hectare:
- 100 g/m2 * 10,000 m2 = 1,000,000 g = 1000 kg dry biomass
- Carbon: 1000 kg * 0.45 = 450 kg C
- CO2e: 450 * 44/12 = 1650 kg CO2e
"""


from typing import Optional, Dict
import math
from datetime import datetime, timedelta


DEFAULT_CARBON_FRACTION = 0.45  # ~fraction of dry biomass that's carbon
C_TO_CO2 = 44.0 / 12.0          # conversion factor from C mass to CO2 mass


def biomass_g_m2_to_carbon_kg(biomass_g_m2: float, area_m2: float, carbon_fraction: float = DEFAULT_CARBON_FRACTION) -> float:
    """
    Convert grams per m2 biomass to kg of carbon stored on the specified area.
    Steps:
      - total biomass grams = biomass_g_m2 * area_m2
      - convert grams -> kg: / 1000
      - carbon_kg = total_kg * carbon_fraction
    """
    total_biomass_g = biomass_g_m2 * area_m2
    total_biomass_kg = total_biomass_g / 1000.0
    carbon_kg = total_biomass_kg * carbon_fraction
    return carbon_kg


def carbon_kg_to_co2e_kg(carbon_kg: float) -> float:
    """Convert kg C to kg CO2 equivalent."""
    return carbon_kg * C_TO_CO2


def biomass_and_area_to_co2e(biomass_g_m2: float, area_m2: float, carbon_fraction: float = DEFAULT_CARBON_FRACTION) -> Dict[str, float]:
    """
    Convenience function: given biomass (g/m2) and area (m2) return derived metrics:
    - carbon_kg
    - co2e_kg
    - biomass_kg_total
    """
    total_biomass_g = biomass_g_m2 * area_m2
    biomass_kg_total = total_biomass_g / 1000.0
    carbon_kg = biomass_kg_total * carbon_fraction
    co2e_kg = carbon_kg_to_co2e_kg(carbon_kg)
    return {"biomass_kg": biomass_kg_total, "carbon_kg": carbon_kg, "co2e_kg": co2e_kg}


def estimate_annual_sequestration_rate(previous_biomass_g_m2: float,
                                       current_biomass_g_m2: float,
                                       area_m2: float,
                                       interval_days: int,
                                       carbon_fraction: float = DEFAULT_CARBON_FRACTION) -> Dict[str, float]:
    """
    Estimate annualized CO2e sequestration given two biomass snapshots.
    - previous_biomass_g_m2: earlier measurement (g/m2)
    - current_biomass_g_m2: later measurement (g/m2)
    - area_m2: area covered by measurement
    - interval_days: days between the two measurements


    Returns: dict with delta_biomass_g_m2, delta_carbon_kg, annualized_co2e_kg_per_year
    """
    delta_g_m2 = current_biomass_g_m2 - previous_biomass_g_m2
    delta_total_g = delta_g_m2 * area_m2
    delta_kg = delta_total_g / 1000.0
    delta_carbon_kg = delta_kg * carbon_fraction
    delta_co2e_kg = carbon_kg_to_co2e_kg(delta_carbon_kg)


    # annualize: scale by 365 / interval_days
    if interval_days <= 0:
        annualized_co2e = None
    else:
        annualized_co2e = delta_co2e_kg * (365.0 / float(interval_days))


    return {
        "delta_biomass_g_m2": delta_g_m2,
        "delta_biomass_kg": delta_kg,
        "delta_carbon_kg": delta_carbon_kg,
        "delta_co2e_kg": delta_co2e_kg,
        "annualized_co2e_kg_per_year": annualized_co2e
    }


# --- Biodiversity proxy: color diversity / NDVI variance ---
import numpy as np


def biodiversity_proxy_from_image_array(rgb_array: np.ndarray) -> float:
    """
    Simple biodiversity proxy: compute normalized color-channel diversity and texture.
    Input: rgb_array shape (H,W,3), values 0..255
    Returns score 0..1 (higher = more diverse color / structural heterogeneity)
    Heuristics:
      - channel stddev normalized
      - local variance across patches (texture)
    """
    if rgb_array is None or rgb_array.size == 0:
        return 0.0
    # channel std
    chan_std = np.std(rgb_array.reshape(-1, 3), axis=0).mean() / 128.0
    chan_std = float(max(0.0, min(1.0, chan_std)))
    # texture: mean of local patch variances
    h, w, _ = rgb_array.shape
    patch = 32
    textures = []
    for y in range(0, h, patch):
        for x in range(0, w, patch):
            block = rgb_array[y:y+patch, x:x+patch, :]
            if block.size == 0:
                continue
            textures.append(np.var(block))
    if len(textures) == 0:
        tex_score = 0.0
    else:
        tex_score = float(np.mean(textures) / (255.0**2))
        tex_score = max(0.0, min(1.0, tex_score * 4.0))
    # combine
    score = 0.6 * chan_std + 0.4 * tex_score
    return float(max(0.0, min(1.0, score)))


def biodiversity_from_ndvi_stats(ndvi_values: np.ndarray) -> float:
    """
    NDVI-based proxy: higher variance and multimodality suggests patchy vegetation (proxy for diversity).
    Returns 0..1.
    """
    if ndvi_values is None or ndvi_values.size == 0:
        return 0.0
    v = float(np.nanvar(ndvi_values))
    # normalize variance roughly (NDVI ranges ~ -1..1 so max var ~1)
    score = min(1.0, v * 2.0)  # scale up
    return float(score)


# --- Simple water-use estimator (placeholder) ---
def estimate_evapotranspiration(lai: float, reference_et_mm: float) -> float:
    """
    Placeholder ET estimator: ET = reference_et * crop_coefficient
    - lai: leaf area index (approx derived from NDVI)
    - reference_et_mm: reference evapotranspiration in mm over period
    Crop coefficient Kc approximated by LAI->Kc mapping (simple)
    Returns: estimated water use in liters per m2 (1 mm = 1 L/m2)
    """
    # crude mapping: Kc = 0.1 + 0.1 * LAI (caps)
    kc = max(0.1, min(1.2, 0.1 + 0.1 * lai))
    et_mm = reference_et_mm * kc
    # liters per m2 same as mm
    return et_mm


def ndvi_to_lai(ndvi: float) -> float:
    """
    Rudimentary NDVI->LAI mapping: LAI ~ a * NDVI + b
    This is a heuristic. Replace with sensor-specific calibration for production.
    """
    # clip ndvi
    ndvi = max(-0.2, min(0.9, ndvi))
    # simple mapping
    lai = max(0.0, (ndvi - 0.05) * 3.0)  # tuned to produce LAI in 0..3
    return lai
