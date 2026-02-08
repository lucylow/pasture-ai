# PastureAI Demo — Quickstart

1. Create virtual env and install deps:

```bash
bash scripts/create_demo_env.sh
```

Generate dataset (if not already):
```bash
python mock_data/generate_synthetic_dataset.py --n 200
```

Run the FastAPI app (development):
```bash
uvicorn app.main:app --reload --port 8000
```

Open `app/demo/frontend/index.html` in a browser or serve it from your server root. Use the upload widget to test predictions.

Run tests:
```bash
pytest -q
```

Notes:
The predictor is deterministic; it works by computing simple image-level statistics and mapping them to biomass outputs.
Use this to exercise frontends, dashboards, and pipelines without requiring a heavy ML model.
