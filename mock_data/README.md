# Mock dataset for PastureAI demo

This dataset is synthetic and intended for demos and UI flows. It contains:

- `output/images/` — PNG images of synthetic pastures
- `output/labels.csv` — CSV file describing per-image biomass and metadata

How to create:

```bash
python mock_data/generate_synthetic_dataset.py --n 500
```

Notes:
Labels are generated from a deterministic mapping from synthetic cover fractions → biomass grams. They are not real measurements.
Use this dataset to test UI flows, demo metrics pages, or to exercise training pipelines without relying on real imagery.
