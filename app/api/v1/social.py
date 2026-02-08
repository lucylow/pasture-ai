from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from app.schemas import UserProfile, Cooperative, Post, PostType, SustainabilityKPIs, UserRole
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1/social", tags=["social"])

# Mock Database
MOCK_USERS = {
    "user1": UserProfile(
        id="user1", 
        username="farmer_joe", 
        role=UserRole.FARMER, 
        reputation_score=85.5,
        trust_score=0.92,
        impact_badges=["Regen Pioneer", "Top Observer"]
    )
}

MOCK_COOPS = {
    "coop1": Cooperative(
        id="coop1",
        name="Valley Regenerative Collective",
        region="Northern Tablelands",
        member_ids=["user1"],
        total_biomass_managed=1250.0,
        sustainability_rating=4.8,
        carbon_sequestration_total=450.2
    )
}

MOCK_POSTS = [
    Post(
        id="p1",
        author_id="user1",
        author_name="farmer_joe",
        type=PostType.OBSERVATION,
        content="Noticed strong biomass recovery in Paddock 4 after 30 days rest.",
        reactions={"👍": 12, "🌱": 8},
        peer_validated=True
    )
]

@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    if user_id not in MOCK_USERS:
        raise HTTPException(status_code=404, detail="User not found")
    return MOCK_USERS[user_id]

@router.get("/feed", response_model=List[Post])
async def get_feed():
    return MOCK_POSTS

@router.post("/posts", response_model=Post)
async def create_post(post: Post):
    MOCK_POSTS.insert(0, post)
    return post

@router.get("/cooperatives/{coop_id}", response_model=Cooperative)
async def get_cooperative(coop_id: str):
    if coop_id not in MOCK_COOPS:
        raise HTTPException(status_code=404, detail="Cooperative not found")
    return MOCK_COOPS[coop_id]

@router.get("/kpis/{user_id}", response_model=SustainabilityKPIs)
async def get_user_kpis(user_id: str):
    # In a real app, these would be calculated from historical data
    return SustainabilityKPIs(
        grazing_efficiency_delta=0.18,
        rest_period_compliance=0.95,
        biomass_stability_index=0.88,
        overgrazing_prevention_score=0.92,
        peer_validated_adoption_rate=0.75,
        soil_carbon_sequestration=2.4
    )
