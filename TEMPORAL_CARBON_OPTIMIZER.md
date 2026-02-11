# PastureAI: Temporal + Carbon + Multi-Pasture Optimization

Backend expansion adding **temporal intelligence**, **carbon accumulation**, and **multi-pasture optimization** on top of Image2Biomass. Engineers can run immediately with realistic mock data.

## Pipeline Overview

```
Image2Biomass (per-image, spatial)
        ↓
Temporal Growth Model (RNN / growth curves)
        ↓
Carbon & Soil Accumulation Model
        ↓
Multi-Pasture Optimization Solver
```

## Quick Start

```bash
# Start the API
uvicorn app.main:app --reload

# End-to-end pipeline (single pasture)
curl http://localhost:8000/api/v1/temporal/pipeline/P1

# Temporal timeseries
curl http://localhost:8000/api/v1/temporal/timeseries/P1?days=90

# Growth forecast (POST)
curl -X POST http://localhost:8000/api/v1/temporal/forecast \
  -H "Content-Type: application/json" \
  -d '[{"biomass_t_ha":2.5,"rainfall_mm":8,"temperature_c":20,"grazing_pressure":0.1}]'

# Carbon state
curl http://localhost:8000/api/v1/temporal/carbon/mock

# Multi-pasture optimization
curl -X POST http://localhost:8000/api/v1/temporal/optimize \
  -H "Content-Type: application/json" \
  -d '{"herd_demand_tonnes":35,"horizon_days":90}'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/temporal/timeseries/{pasture_id}` | GET | Mock temporal time-series |
| `/api/v1/temporal/forecast` | POST | Next-day biomass from sequence |
| `/api/v1/temporal/carbon/mock` | GET | Mock carbon state |
| `/api/v1/temporal/pastures/mock` | GET | Mock multi-pasture state |
| `/api/v1/temporal/optimize` | POST | Grazing optimization plan |
| `/api/v1/temporal/pipeline/{pasture_id}` | GET | Full end-to-end demo |

## File Structure

```
app/
  schemas/temporal.py      # TemporalBiomassPoint, PastureTimeSeries
  mock/
    temporal_data.py       # generate_mock_timeseries()
    carbon.py              # mock_carbon_state()
    pastures.py            # mock_pastures(), PastureState
  models/
    temporal_growth.py     # BiomassRNN (PyTorch LSTM)
    carbon.py              # estimate_carbon_change()
  pipelines/
    temporal_inference.py   # predict_growth() - RNN or heuristic
    optimizer.py           # optimize_grazing()
  api/v1/temporal.py       # FastAPI router
```

## Training the RNN (Optional)

Without a trained model, `predict_growth()` uses a heuristic. To train:

```bash
python scripts/train_temporal_rnn.py
```

Saves `models/temporal_v1.pt` for use by the pipeline.

## Tests

```bash
pytest tests/test_temporal_pipeline.py -v
```

## Layers

| Layer | What it gives |
|-------|---------------|
| Image2Biomass | Spatial truth |
| Temporal RNN | Growth foresight |
| Carbon model | Sustainability accounting |
| Optimization | Farm-level decisions |
