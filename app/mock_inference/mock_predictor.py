"""
A minimal deterministic predictor for demo purposes.
Given an image, it computes a few simple statistics (mean green channel, green dominance, coverage estimate)
and maps them to biomass-like outputs using linear heuristics.

This is *not* ML — it's intentionally simple so the demo is deterministic and fast.
Clips: 0.05-400 g/m². No NaNs.
"""

from PIL import Image
import numpy as np
from typing import Dict
import logging

logger = logging.getLogger(__name__)

HEALTH_BUCKETS = [(30, "poor"), (60, "fair"), (100, "good")]

def _image_stats(img: Image.Image):
    # Ensure image is RGB
    arr = np.array(img.convert("RGB"))
    h, w, _ = arr.shape
    total = h * w
    
    # Use float64 for intermediate calculations to avoid overflow
    r = arr[..., 0].astype(np.float64)
    g = arr[..., 1].astype(np.float64)
    b = arr[..., 2].astype(np.float64)
    
    mean_r = float(np.mean(r))
    mean_g = float(np.mean(g))
    mean_b = float(np.mean(b))
    
    # green dominance: normalized difference between green and red+blue
    # Use epsilon to avoid div0
    denom = 255.0
    green_dom = float((mean_g - (mean_r + mean_b) / 2.0) / denom)
    
    # simple coverage: fraction of pixels where green channel is much higher than red and blue
    # or yellow (dead) or pink (clover)
    # Using HSV for better segmentation as in the generator
    hsv = np.array(img.convert("HSV"))
    h_chan = hsv[..., 0]
    s_chan = hsv[..., 1]
    v_chan = hsv[..., 2]
    
    # Green: Hue 40-80
    green_mask = (h_chan >= 40) & (h_chan <= 80) & (s_chan >= 40) & (v_chan >= 40)
    # Yellow: Hue 20-30
    dead_mask = (h_chan >= 20) & (h_chan <= 30) & (s_chan >= 100) & (v_chan >= 100)
    # Pink: Hue 150-170
    clover_mask = (h_chan >= 150) & (h_chan <= 170) & (s_chan >= 100) & (v_chan >= 100)
    
    total_mask = green_mask | dead_mask | clover_mask
    coverage = float(np.sum(total_mask) / total * 100.0)
    
    return {
        "mean_r": mean_r,
        "mean_g": mean_g,
        "mean_b": mean_b,
        "green_dom": green_dom,
        "coverage_pct": coverage,
        "green_frac": float(np.sum(green_mask) / total),
        "dead_frac": float(np.sum(dead_mask) / total),
        "clover_frac": float(np.sum(clover_mask) / total)
    }

def predict_from_pil(img: Image.Image) -> Dict:
    s = _image_stats(img)
    
    # map stats into biomass grams (toy linear mapping)
    # Clips: 0.05-400 g/m²
    dry_green_g = np.clip(s["green_frac"] * 300, 0.05, 400)
    dry_dead_g = np.clip(s["dead_frac"] * 100, 0.05, 400)
    dry_clover_g = np.clip(s["clover_frac"] * 50, 0.05, 400)
    
    gdm_g = dry_green_g + dry_clover_g
    dry_total_g = np.clip(gdm_g + dry_dead_g, 0.05, 400)
    
    # determine pasture health
    health = "poor"
    for thresh, label in HEALTH_BUCKETS:
        if s["coverage_pct"] <= thresh:
            health = label
            break
    else:
        health = "good"
            
    result = {
        "predictions": {
            "Dry_Green_g": round(float(dry_green_g), 2),
            "Dry_Dead_g": round(float(dry_dead_g), 2),
            "Dry_Clover_g": round(float(dry_clover_g), 2),
            "GDM_g": round(float(gdm_g), 2),
            "Dry_Total_g": round(float(dry_total_g), 2),
        },
        "metrics": {
            "coverage_pct": round(s["coverage_pct"], 2),
            "green_dom": round(s["green_dom"], 4),
            "pasture_health": health
        },
        "confidence_score": round(min(0.9, 0.5 + abs(s["green_dom"]) * 0.8), 2)
    }
    return result

def predict_from_path(path: str):
    try:
        img = Image.open(path)
        # Handle EXIF orientation if needed, but for mock it's fine
        return predict_from_pil(img)
    except Exception as e:
        logger.error(f"Error predicting from path {path}: {e}")
        # Return a safe fallback
        return {
            "predictions": {"Dry_Green_g": 0.05, "Dry_Dead_g": 0.05, "Dry_Clover_g": 0.05, "GDM_g": 0.1, "Dry_Total_g": 0.15},
            "metrics": {"coverage_pct": 0.0, "green_dom": 0.0, "pasture_health": "poor"},
            "confidence_score": 0.0,
            "error": str(e)
        }
