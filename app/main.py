from fastapi import FastAPI
from app.api.v1.biomass import router as biomass_router
from app.sustainability.api import router as sustainability_router
from app.db.base_class import engine, Base
from app.api.v1.social import router as social_router
from app.api.v1.mock_biomass import router as mock_router
from app.api.v1.image2biomass import router as image2biomass_router
from app.api.v1.temporal import router as temporal_router
from app.api.v1.regulatory import router as regulatory_router

app = FastAPI(title="PastureAI")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health():
    return {"status": "healthy"}

app.include_router(biomass_router)
app.include_router(sustainability_router)
app.include_router(social_router)
app.include_router(mock_router)
app.include_router(image2biomass_router)
app.include_router(temporal_router)
app.include_router(regulatory_router)
