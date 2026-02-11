# app/schemas/temporal.py
"""
Temporal time-series schemas for PastureAI growth forecasting.
Feeds into BiomassRNN and carbon/optimization pipelines.
"""
from typing import List
from pydantic import BaseModel


class TemporalBiomassPoint(BaseModel):
    date: str
    biomass_t_ha: float
    rainfall_mm: float
    temperature_c: float
    grazing_pressure: float  # 0–1


class PastureTimeSeries(BaseModel):
    pasture_id: str
    history: List[TemporalBiomassPoint]
