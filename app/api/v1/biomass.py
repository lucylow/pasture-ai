from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List
from pathlib import Path
import shutil
from app.core.ai_model import get_predictor
from app.config import settings

router = APIRouter(prefix="/api/v1/biomass", tags=["biomass"])

@router.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    # save temporarily
    tmp_dir = Path(settings.TMP_DIR)
    tmp_dir.mkdir(parents=True, exist_ok=True)
    tmp_path = tmp_dir / file.filename
    with tmp_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    predictor = get_predictor()
    try:
        result = await predictor.predict_biomass(str(tmp_path))
    finally:
        try: tmp_path.unlink()
        except: pass
    return result

@router.post("/predict/batch")
async def predict_batch(files: List[UploadFile] = File(...)):
    predictor = get_predictor()
    results = []
    for file in files:
        tmp_path = Path(settings.TMP_DIR) / file.filename
        with tmp_path.open("wb") as f:
            shutil.copyfileobj(file.file, f)
        try:
            out = await predictor.predict_biomass(str(tmp_path))
            results.append({"filename": file.filename, "result": out})
        finally:
            try: tmp_path.unlink()
            except: pass
    return {"batch_results": results}
