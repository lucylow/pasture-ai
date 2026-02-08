#!/usr/bin/env python3
"""
Generates a synthetic pasture dataset for demo purposes.
Outputs:
- mock_images/ (PNG images)
- labels.csv (CSV with columns: image_path, dry_green_g, dry_dead_g, dry_clover_g, gdm_g, dry_total_g, coverage_pct, pasture_health)

This generator builds images with colored blobs and noise so that a simple image-statistics-based predictor can correlate features to labels.
"""

import os
from pathlib import Path
import random
import csv
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

OUT_DIR = Path("mock_data/output")
IMG_DIR = OUT_DIR / "images"
LABELS_CSV = OUT_DIR / "labels.csv"

IMG_DIR.mkdir(parents=True, exist_ok=True)

# helper: create a synthetic pasture image
def create_pasture_image(width=640, height=480, green_cover=0.5, dead_cover=0.1, clover_cover=0.05):
    # start with soil background
    base_color = (150, 120, 80)  # brown soil
    img = Image.new("RGB", (width, height), base_color)
    draw = ImageDraw.Draw(img)

    # paint green blobs for live grass
    num_blobs = int(30 + green_cover * 100)
    for i in range(num_blobs):
        r = random.randint(20, 80)
        x = random.randint(0, width)
        y = random.randint(0, height)
        g = int(120 + green_cover * 120 + random.randint(-10, 10))
        color = (random.randint(20, 60), g, random.randint(20, 60))
        bbox = (x - r, y - r, x + r, y + r)
        draw.ellipse(bbox, fill=color)

    # dead grass (yellow-ish)
    num_dead = int(10 + dead_cover * 100)
    for i in range(num_dead):
        r = random.randint(10, 60)
        x = random.randint(0, width)
        y = random.randint(0, height)
        color = (random.randint(150, 200), random.randint(120, 160), random.randint(40, 90))
        bbox = (x - r, y - r, x + r, y + r)
        draw.ellipse(bbox, fill=color)

    # clover patches (dark green, small)
    num_clover = int(5 + clover_cover * 50)
    for i in range(num_clover):
        r = random.randint(6, 18)
        x = random.randint(0, width)
        y = random.randint(0, height)
        color = (20, random.randint(80, 140), 30)
        for dx in (-r, 0, r):
            for dy in (-r, 0, r):
                draw.ellipse((x + dx - r, y + dy - r, x + dx + r, y + dy + r), fill=color)

    # global blur and noise
    if random.random() < 0.4:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.6, 2.2)))

    # add speckle noise
    arr = np.array(img).astype(np.int16)
    noise = np.random.normal(scale=8.0, size=arr.shape)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr)
    return img

# mapping from cover fractions to biomass grams per sample area (synthetic linear relationship)
def cover_to_biomass(green_cover, dead_cover, clover_cover):
    # These coefficients are chosen to produce realistic-looking demo numbers.
    dry_green = max(0.0, green_cover * 1200.0 + random.gauss(0, 50))
    dry_dead = max(0.0, dead_cover * 900.0 + random.gauss(0, 30))
    dry_clover = max(0.0, clover_cover * 600.0 + random.gauss(0, 20))
    gdm = dry_green + dry_dead + dry_clover
    dry_total = gdm
    coverage_pct = min(100.0, (green_cover + dead_cover + clover_cover) * 100.0 + random.gauss(0, 3))
    # simple health label mapping
    if coverage_pct < 20:
        health = "poor"
    elif coverage_pct < 45:
        health = "fair"
    elif coverage_pct < 70:
        health = "good"
    else:
        health = "excellent"
    return dry_green, dry_dead, dry_clover, gdm, dry_total, coverage_pct, health


def generate_dataset(n_images=500, out_dir=OUT_DIR):
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    for i in range(n_images):
        # sample cover fractions with some correlation patterns
        green = max(0.01, random.betavariate(2, 3))  # more low-medium rather than all high
        dead = max(0.0, random.betavariate(1, 6) * (1 - green))
        clover = max(0.0, random.betavariate(0.7, 8) * (1 - green - dead))
        img = create_pasture_image(width=640, height=480, green_cover=green, dead_cover=dead, clover_cover=clover)
        fname = f"img_{i:04d}.png"
        p = IMG_DIR / fname
        img.save(p, format="PNG")
        dry_green, dry_dead, dry_clover, gdm, dry_total, cov, health = cover_to_biomass(green, dead, clover)
        rows.append({
            "image_path": str(p.relative_to(OUT_DIR)),
            "dry_green_g": round(float(dry_green), 2),
            "dry_dead_g": round(float(dry_dead), 2),
            "dry_clover_g": round(float(dry_clover), 2),
            "gdm_g": round(float(gdm), 2),
            "dry_total_g": round(float(dry_total), 2),
            "coverage_pct": round(float(cov), 2),
            "pasture_health": health
        })
    # save CSV
    with open(LABELS_CSV, "w", newline="") as csvfile:
        fieldnames = ["image_path","dry_green_g","dry_dead_g","dry_clover_g","gdm_g","dry_total_g","coverage_pct","pasture_health"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)
    print(f"Wrote {len(rows)} images to {IMG_DIR} and labels to {LABELS_CSV}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--n", type=int, default=500)
    args = parser.parse_args()
    generate_dataset(n_images=args.n)
