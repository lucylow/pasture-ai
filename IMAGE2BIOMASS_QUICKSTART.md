# Image2Biomass Quickstart

Developer checklist to run the Image2Biomass pipeline locally.

## 1. Clone & env

```bash
git clone <repo>
cd blank-page-feb9-2026
```

Create `.env` (or `.env.local`) with:
```
VITE_MAPBOX_TOKEN=pk.your_mapbox_token
VITE_API_BASE=http://localhost:8000
```

## 2. Start inference server

```bash
cd inference_server
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Or from repo root: PYTHONPATH=inference_server uvicorn app.main:app --reload --port 8000
```

Or with Docker:
```bash
docker-compose -f docker-compose-image2biomass.yml up
```

## 3. Train model (optional)

```bash
cd models
python train.py   # Uses synthetic data, creates runs/best_model.pth
python export_torchscript.py
```

## 4. Start frontend

```bash
npm ci && npm run dev
```

## 5. Verify

- Open http://localhost:8080/pasture/demo
- Map shows biomass layer (pilot GeoJSON or mock)
- Inference health: http://localhost:8000/api/v1/health

## Project layout

```
/data_pipeline     - ingest, orthomosaic, indices, tile_generator
/models           - PyTorch U-Net, train, export_torchscript
/inference_server - FastAPI predict + tiles
/src/components/ai - BiomassMap, BiomassLegend, AIBiomassLayer
```

## API endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/v1/predict | POST | Predict biomass for tile (pasture_id, tile_z, tile_x, tile_y) |
| /api/v1/tiles/{id}/{z}/{x}/{y}.tif | GET | Serve GeoTIFF tile |
| /api/v1/health | GET | Health check |
