from pydantic import BaseModel, Field
from typing import Dict, Optional, List
from datetime import datetime, timezone
from enum import Enum

class BiomassPredictions(BaseModel):
    Dry_Green_g: float
    Dry_Dead_g: float
    Dry_Clover_g: float
    GDM_g: float
    Dry_Total_g: float

class BiomassMetrics(BaseModel):
    biomass_density_g_m2: float
    pasture_health: str
    greenness_index: float
    coverage_pct: float

class BiomassPrediction(BaseModel):
    predictions: BiomassPredictions
    metrics: BiomassMetrics
    confidence_score: float
    processing_time_ms: float
    model_version: str
    timestamp: str
    metadata: Optional[Dict] = None

class PastureHealth(BaseModel):
    status: str

# --- Social & Community Layer Schemas ---

class UserRole(str, Enum):
    FARMER = "farmer"
    COOP_ADMIN = "coop_admin"
    REGIONAL_ADVISOR = "regional_advisor"
    GUEST = "guest"

class UserProfile(BaseModel):
    id: str
    username: str
    role: UserRole
    reputation_score: float = 0.0
    bio: Optional[str] = None
    farm_ids: List[str] = []
    trust_score: float = 0.0
    impact_badges: List[str] = []

class Cooperative(BaseModel):
    id: str
    name: str
    region: str
    member_ids: List[str]
    total_biomass_managed: float
    sustainability_rating: float
    carbon_sequestration_total: float

class PostType(str, Enum):
    OBSERVATION = "observation"
    JOURNAL_ENTRY = "journal_entry"
    COMMUNITY_GOAL = "community_goal"
    ALERT = "alert"

class Post(BaseModel):
    id: str
    author_id: str
    author_name: str
    type: PostType
    content: str
    media_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reactions: Dict[str, int] = {}
    comments_count: int = 0
    peer_validated: bool = False

class SustainabilityKPIs(BaseModel):
    grazing_efficiency_delta: float
    rest_period_compliance: float
    biomass_stability_index: float
    overgrazing_prevention_score: float
    peer_validated_adoption_rate: float
    soil_carbon_sequestration: float  # tCO2e / ha

class StewardshipUnit(BaseModel):
    id: str
    farmer_id: str
    value: float
    issued_at: datetime
    kpi_evidence: SustainabilityKPIs

# --- Image2Biomass Integration Schemas ---

class ImagerySource(str, Enum):
    SATELLITE = "satellite"
    DRONE = "drone"
    GROUND_CAMERA = "ground_camera"

class ImageryMetadata(BaseModel):
    id: str
    provider: str
    capture_time: datetime
    sensor_type: ImagerySource
    bands: List[str]
    gcs_uri: str
    bbox: List[float] # [min_lng, min_lat, max_lng, max_lat]
    crs: str = "EPSG:4326"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TilePrediction(BaseModel):
    id: str
    pasture_id: str
    tile_z: int
    tile_x: int
    tile_y: int
    biomass_mean: float # t/ha
    biomass_std: float
    model_version: str
    timestamp: datetime
    provenance: Dict

class GroundTruthSample(BaseModel):
    id: str
    pasture_id: str
    sample_time: datetime
    lat: float
    lng: float
    biomass_t_ha: float
    sample_method: str
    notes: Optional[str] = None

class AuditLog(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_id: str
    action: str
    model_version: str
    confidence: float
    pasture_id: str
    details: Dict

class InferenceRequest(BaseModel):
    sources: List[ImagerySource] = [ImagerySource.SATELLITE, ImagerySource.DRONE]
    force: bool = False

class SimulationScenario(BaseModel):
    startInDays: int
    durationDays: int
    stockingRate: float

class SimulationRequest(BaseModel):
    scenario: SimulationScenario

class SimulationResponse(BaseModel):
    recoveryDays: int
    postBiomass: float
    soilImpact: str

class ForecastItem(BaseModel):
    date: str
    predicted: float
    lower: float
    upper: float

class Recommendation(BaseModel):
    action: str
    suggestedInDays: int
    reasoning: List[str]

class Explainability(BaseModel):
    topDrivers: List[Dict[str, float]]

class Provenance(BaseModel):
    sources: List[str]
    groundSamples: int

class FullBiomassPredictionResponse(BaseModel):
    pastureId: str
    timestamp: datetime
    modelVersion: str
    tileUrl: str
    biomass_mean_t_ha: float
    biomass_std_t_ha: float
    forecast: List[ForecastItem]
    recommendation: Recommendation
    explainability: Explainability
    provenance: Provenance
