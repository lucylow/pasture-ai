# app/sustainability/models.py
"""
SQLAlchemy models to store sustainability metrics, goals, and planner results.
Assumes you have app.db.base_class.Base or similar in your project.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base


class Farm(Base):
    __tablename__ = "farm"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    area_ha = Column(Float, nullable=False)  # farm area in hectares
    location = Column(String, nullable=True)
    metadata = Column(JSON, default={})
    created_at = Column(DateTime, server_default=func.now())


class Paddock(Base):
    __tablename__ = "paddock"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farm.id"))
    name = Column(String, nullable=False)
    area_ha = Column(Float, nullable=False)
    polygon_geojson = Column(JSON, nullable=True)  # optional geofence
    created_at = Column(DateTime, server_default=func.now())
    farm = relationship("Farm", backref="paddocks")


class SustainabilityRecord(Base):
    __tablename__ = "sustainability_record"
    id = Column(Integer, primary_key=True, index=True)
    paddock_id = Column(Integer, ForeignKey("paddock.id"), nullable=True)
    recorded_at = Column(DateTime, server_default=func.now(), index=True)
    source = Column(String, nullable=True)  # e.g., 'drone', 'mobile', 'satellite'
    area_m2 = Column(Float, nullable=False)  # area that measurement covers
    # raw inputs
    ndvi_mean = Column(Float, nullable=True)
    coverage_pct = Column(Float, nullable=True)
    dry_biomass_g_m2 = Column(Float, nullable=True)  # grams per square meter
    # derived sustainability metrics
    carbon_kg = Column(Float, nullable=True)       # kg of carbon (organic) in above-ground biomass
    co2e_kg = Column(Float, nullable=True)         # kg CO2e equivalent
    sequestration_estimate_kgco2e_per_year = Column(Float, nullable=True)
    biodiversity_index = Column(Float, nullable=True)
    water_use_estimate_l = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    meta = Column(JSON, default={})
    paddock = relationship("Paddock", backref="sustainability_records")


class SustainabilityGoal(Base):
    __tablename__ = "sustainability_goal"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farm.id"))
    key = Column(String, nullable=False)  # e.g., 'annual_co2e_target_tonnes'
    target_value = Column(Float, nullable=False)
    unit = Column(String, default="kgCO2e")
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    metadata = Column(JSON, default={})
    farm = relationship("Farm")
