from fastapi import APIRouter, UploadFile, File
import shutil
from pathlib import Path
from app.mock_inference.mock_predictor import predict_from_path

router = APIRouter(prefix="/api/v1/mock", tags=["mock_biomass"])

TMP_DIR = Path("tmp/pasture_demo")
TMP_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/predict")
async def predict_single(file: UploadFile = File(...)):
    tmp_path = TMP_DIR / file.filename
    with tmp_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    result = predict_from_path(str(tmp_path))
    try:
        tmp_path.unlink()
    except Exception:
        pass
    return result

@router.post("/predict/batch")
async def predict_batch(files: list[UploadFile] = File(...)):
    results = []
    for file in files:
        tmp_path = TMP_DIR / file.filename
        with tmp_path.open("wb") as f:
            shutil.copyfileobj(file.file, f)
        out = predict_from_path(str(tmp_path))
        results.append({"filename": file.filename, "result": out})
        try:
            tmp_path.unlink()
        except Exception:
            pass
    return {"batch_results": results}

@router.get("/models")
def list_models():
    # demo: return single mocked model entry
    return [{"name": "mock_predictor_v1", "description": "Deterministic demo predictor", "version": "v1"}]
