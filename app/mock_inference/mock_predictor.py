"""
A minimal deterministic predictor for demo purposes.
Given an image, it computes a few simple statistics (mean green channel, green dominance, coverage estimate)
and maps them to biomass-like outputs using linear heuristics.

This is *not* ML — it's intentionally simple so the demo is deterministic and fast.
"""

from PIL import Image
import numpy as np
from typing import Dict

HEALTH_BUCKETS = [(20, "poor"), (45, "fair"), (70, "good"), (100, "excellent")]


def _image_stats(img: Image.Image):
    arr = np.array(img.convert("RGB"))
    h, w, _ = arr.shape
    total = h * w
    r = arr[..., 0].astype(np.float32)
    g = arr[..., 1].astype(np.float32)
    b = arr[..., 2].astype(np.float32)
    mean_r = float(r.mean())
    mean_g = float(g.mean())
    mean_b = float(b.mean())
    # green dominance: normalized difference between green and red+blue
    green_dom = float((mean_g - (mean_r + mean_b) / 2.0) / 255.0)
    # simple coverage: fraction of pixels where green channel is much higher than red and blue
    mask = (g > r + 10) & (g > b + 10)
    coverage = float(mask.sum() / total * 100.0)
    return {
        "mean_r": mean_r,
        "mean_g": mean_g,
        "mean_b": mean_b,
        "green_dom": green_dom,
        "coverage_pct": coverage
    }


def predict_from_pil(img: Image.Image) -> Dict:
    s = _image_stats(img)
    # map stats into biomass grams (toy linear mapping)
    # coefficients chosen to produce human-plausible demo values
    dry_green_g = max(0.0, (s["mean_g"] - 30.0) * 9.0 + s["coverage_pct"] * 2.0)
    dry_dead_g = max(0.0, (100.0 - s["mean_g"]) * 1.5)
    dry_clover_g = max(0.0, s["coverage_pct"] * 0.3)
    gdm_g = dry_green_g + dry_dead_g + dry_clover_g
    dry_total_g = gdm_g
    # determine pasture health
    health = "poor"
    for thresh, label in HEALTH_BUCKETS:
        if s["coverage_pct"] <= thresh:
            health = label
            break
    result = {
        "predictions": {
            "Dry_Green_g": round(dry_green_g, 2),
            "Dry_Dead_g": round(dry_dead_g, 2),
            "Dry_Clover_g": round(dry_clover_g, 2),
            "GDM_g": round(gdm_g, 2),
            "Dry_Total_g": round(dry_total_g, 2),
        },
        "metrics": {
            "coverage_pct": round(s["coverage_pct"], 2),
            "green_dom": round(s["green_dom"], 4),
            "pasture_health": health
        },
        "confidence_score": round(min(0.9, 0.5 + abs(s["green_dom"]) * 0.8), 2)
    }
    return result


# convenience wrapper for file path
def predict_from_path(path: str):
    img = Image.open(path)
    return predict_from_pil(img)
