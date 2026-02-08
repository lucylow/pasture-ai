"""
Simple analysis script:
- Load labels CSV, plot histograms of Dry_Total_g and coverage
- Visualize a few example images with their labels
"""

import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from PIL import Image

OUT = Path('mock_data/output')
labels = pd.read_csv(OUT / 'labels.csv')

print(labels.describe())

plt.figure(figsize=(8,4))
plt.hist(labels['dry_total_g'], bins=50)
plt.title('Distribution of Dry Total (g)')
plt.xlabel('Dry total (g)')
plt.show()

plt.figure(figsize=(8,4))
plt.hist(labels['coverage_pct'], bins=30)
plt.title('Coverage %')
plt.show()

# show 6 examples
for idx in range(6):
    row = labels.iloc[idx]
    img = Image.open(OUT / row['image_path'])
    plt.figure(figsize=(4,3))
    plt.imshow(img)
    plt.axis('off')
    plt.title(f"{row['image_path']} | Dry {row['dry_total_g']}g | Cov {row['coverage_pct']}%")
    plt.show()
