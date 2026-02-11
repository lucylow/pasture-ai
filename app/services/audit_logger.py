# app/services/audit_logger.py
"""
Append-only audit logger for grazing and carbon decisions.
Writes to pluggable store (file, S3, BigQuery); swap for production.
"""
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, Dict

# Pluggable write function; replace for S3, BigQuery, etc.
_write_fn: Callable[[Dict], None] | None = None


def _default_file_store(log: Dict) -> None:
    """Append to JSONL file. Replace with S3/BigQuery for production."""
    # Ensure timestamp is JSON-serializable
    payload = dict(log)
    if isinstance(payload.get("timestamp"), datetime):
        payload["timestamp"] = payload["timestamp"].isoformat()

    audit_dir = Path(__file__).resolve().parents[2] / "audit_logs"
    audit_dir.mkdir(exist_ok=True)
    path = audit_dir / "audit.jsonl"
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(payload, default=str) + "\n")


def configure_audit_store(write_fn: Callable[[Dict], None] | None = None) -> None:
    """
    Set the audit store writer. None = use default file-backed store.
    Example for S3: configure_audit_store(lambda log: s3.put_object(...))
    """
    global _write_fn
    _write_fn = write_fn


def write_to_audit_store(log: Dict[str, Any]) -> None:
    """Write log to configured store. Default: append-only JSONL file."""
    writer = _write_fn or _default_file_store
    writer(log)


def log_decision(
    farm_id: str,
    pasture_id: str,
    decision_type: str,
    model_versions: Dict[str, str],
    inputs: Dict[str, Any],
    outputs: Dict[str, Any],
    constraints: Dict[str, Any],
    user_id: str = "system",
) -> Dict[str, Any]:
    """
    Log a grazing, carbon, or optimization decision immutably.
    Returns the log record for confirmation.
    """
    log = {
        "event_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow(),
        "farm_id": farm_id,
        "pasture_id": pasture_id,
        "decision_type": decision_type,
        "model_versions": model_versions,
        "inputs": inputs,
        "outputs": outputs,
        "constraints_applied": constraints,
        "user_id": user_id,
    }

    write_to_audit_store(log)
    return log
