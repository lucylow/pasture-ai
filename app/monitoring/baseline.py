# app/monitoring/baseline.py
"""
Drift baseline storage: capture reference stats for later comparison.
File-based for dev; swap for Redis/S3 in production.
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

_BASELINE_PATH = Path(__file__).resolve().parents[2] / "drift_baselines"
_BASELINE_PATH.mkdir(exist_ok=True)


def save_baseline(model_name: str, stats: Dict[str, float]) -> Dict:
    """Store reference stats for a model."""
    record = {
        "model_name": model_name,
        "stats": stats,
        "captured_at": datetime.utcnow().isoformat(),
    }
    path = _BASELINE_PATH / f"{model_name.replace('/', '_')}_baseline.json"
    path.write_text(json.dumps(record, indent=2))
    return record


def load_baseline(model_name: str) -> Optional[Dict]:
    """Load reference stats for a model."""
    path = _BASELINE_PATH / f"{model_name.replace('/', '_')}_baseline.json"
    if not path.exists():
        return None
    return json.loads(path.read_text())


def list_baselines() -> list:
    """List all stored baselines."""
    out = []
    for p in _BASELINE_PATH.glob("*_baseline.json"):
        name = p.stem.replace("_baseline", "")
        out.append({"model_name": name, "path": str(p)})
    return out
