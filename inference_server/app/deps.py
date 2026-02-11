"""
Dependency injection for FastAPI.
"""
from pathlib import Path

def get_model_path() -> str:
    return "runs/biomass_model_ts.pt"
