# app/exports/csv_export.py
"""
CSV export for grazing and carbon decisions.
Carbon programs, government pilots, enterprise farms.
"""
import csv
from pathlib import Path
from typing import List, Dict, Any


FIELDS = [
    "date",
    "pasture_id",
    "biomass_before",
    "biomass_after",
    "graze_tonnes",
    "recovery_days",
    "carbon_delta",
]


def export_grazing_csv(decisions: List[Dict[str, Any]], filepath: str | Path) -> Path:
    """
    Export grazing decisions to CSV for regulatory submission.
    Each decision should have the FIELDS keys (or compatible aliases).
    """
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)

    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        for d in decisions:
            row = {k: d.get(k, d.get(_alias(k), "")) for k in FIELDS}
            writer.writerow(row)

    return path


def _alias(key: str) -> str:
    """Map field names to common aliases in API responses."""
    aliases = {
        "biomass_before": "biomass_t_ha",
        "biomass_after": "biomass_after_t_ha",
        "carbon_delta": "carbon_impact",
    }
    return aliases.get(key, key)
