# app/schemas/audit_log.py
"""
Audit log schema for regulatory-grade decision traceability.
ESG, carbon programs, subsidy compliance, and legal defensibility.
"""
from datetime import datetime
from typing import Any, Dict

from pydantic import BaseModel


class AuditLog(BaseModel):
    """Immutable record of a grazing, carbon, or optimization decision."""

    event_id: str
    timestamp: datetime
    farm_id: str
    pasture_id: str
    decision_type: str  # grazing | carbon | optimization
    model_versions: Dict[str, str]
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
    constraints_applied: Dict[str, Any]
    user_id: str
