# scripts/seed_sustainability_demo.py
"""
Run to seed demo farm + paddocks + sample sustainability records.
Usage:
  python scripts/seed_sustainability_demo.py
"""
import sys
import os
# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.db.base_class import engine, Base
from app.sustainability import models as s_models
from datetime import datetime, timezone, timedelta
import random

def seed():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    farm = s_models.Farm(name="Demo Farm", area_ha=10.0, location="Demo Valley")
    db.add(farm); db.commit(); db.refresh(farm)
    paddocks = []
    for i in range(1,5):
        p = s_models.Paddock(farm_id=farm.id, name=f"Paddock-{i}", area_ha=2.5)
        db.add(p)
        paddocks.append(p)
    db.commit()
    for p in paddocks:
        db.refresh(p)
        # create 6 monthly records with slight growth trend
        base = 150 + random.uniform(-20,20)
        for m in range(6):
            bm = base + m * random.uniform(5,25)
            area_m2 = p.area_ha * 10000.0
            carbon_kg = (bm * area_m2) / 1000.0 * 0.45
            co2e = carbon_kg * (44.0/12.0)
            rec = s_models.SustainabilityRecord(
                paddock_id=p.id,
                recorded_at=lambda: datetime.now(timezone.utc)() - timedelta(days=(6-m)*30),
                source="drone_demo",
                area_m2=area_m2,
                ndvi_mean=0.2 + (bm/600.0),
                coverage_pct=min(100.0, 20 + bm/6.0),
                dry_biomass_g_m2=bm,
                carbon_kg=carbon_kg,
                co2e_kg=co2e
            )
            db.add(rec)
    db.commit()
    print("Seeded demo farm id", farm.id)
    db.close()


if __name__ == "__main__":
    seed()
