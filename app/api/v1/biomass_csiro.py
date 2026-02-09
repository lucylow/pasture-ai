from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.image2biomass_service import UnifiedBiomassService
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()
service = UnifiedBiomassService(mode='demo') # Default to demo for speed

class BiomassResponse(BaseModel):
    predictions: Dict[str, float]
    metrics: Dict[str, Any]
    confidence_score: float
    grazing_recommendation: Optional[Dict[str, Any]] = None

@router.post("/predict", response_model=Dict[str, Any])
async def predict_biomass(file: UploadFile = File(...)):
    """
    CSIRO-grade biomass estimation from pasture imagery.
    Supports multi-target regression (Green, Dead, Clover, GDM, Total).
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    result = await service.predict(contents)
    
    # Add grazing recommendations
    recs = service.generate_grazing_recs(result)
    result['grazing_recommendation'] = recs
    
    return result

@router.get("/health")
async def health_check():
    return {"status": "active", "mode": service.mode}
