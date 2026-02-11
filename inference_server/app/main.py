"""
PastureAI Inference API: predict, tiles, simulate, audit.
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from pathlib import Path

from .predict import predict_patch, load_model, get_model
from .deps import get_model_path

app = FastAPI(title="PastureAI Inference")


@app.on_event("startup")
def startup():
    path = get_model_path()
    load_model(path)


class PredictRequest(BaseModel):
    pasture_id: str
    tile_z: int
    tile_x: int
    tile_y: int
    sources: list = ["satellite"]


@app.post("/api/v1/predict")
def predict(req: PredictRequest):
    model = get_model()
    try:
        result = predict_patch(
            model,
            req.pasture_id,
            req.tile_z,
            req.tile_x,
            req.tile_y,
            req.sources,
        )
        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/tiles/{pasture_id}/{z}/{x}/{y}.tif")
def get_tile(pasture_id: str, z: int, x: int, y: int):
    path = Path(f"/data/tiles/{pasture_id}/{z}/{x}/{y}.tif")
    if not path.exists():
        raise HTTPException(404, "Tile not found")
    return FileResponse(path)


@app.get("/api/v1/health")
def health():
    return {"status": "ok", "model_loaded": get_model() is not None}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
