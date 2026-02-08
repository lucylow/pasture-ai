# app/sustainability/reports.py
import csv
from io import StringIO, BytesIO
from datetime import datetime
from typing import List
from app.sustainability import models as s_models
from sqlalchemy.orm import Session


def generate_csv_records(records: List[s_models.SustainabilityRecord]) -> str:
    """Return CSV string of records."""
    output = StringIO()
    writer = csv.writer(output)
    header = ["id","paddock_id","recorded_at","area_m2","ndvi_mean","coverage_pct","dry_biomass_g_m2","carbon_kg","co2e_kg","biodiversity_index","water_use_estimate_l"]
    writer.writerow(header)
    for r in records:
        writer.writerow([
            r.id,
            r.paddock_id,
            r.recorded_at.isoformat() if r.recorded_at else "",
            r.area_m2,
            r.ndvi_mean,
            r.coverage_pct,
            r.dry_biomass_g_m2,
            r.carbon_kg,
            r.co2e_kg,
            r.biodiversity_index,
            r.water_use_estimate_l
        ])
    return output.getvalue()


# Placeholder: generate PDF - simple HTML->PDF could be implemented using WeasyPrint or wkhtmltopdf
def generate_pdf_summary(db: Session, farm_id: int) -> bytes:
    """
    Generate a simple PDF as bytes summarizing farm sustainability.
    For brevity: returns an HTML bytes; replace body with actual PDF conversion in production.
    """
    paddocks = db.query(s_models.Paddock).filter(s_models.Paddock.farm_id == farm_id).all()
    html = f"<html><body><h1>Farm {farm_id} Sustainability Report</h1><p>Generated at {datetime.utcnow().isoformat()}</p>"
    for p in paddocks:
        html += f"<h2>Paddock {p.id} - {p.name}</h2>"
        rec = db.query(s_models.SustainabilityRecord).filter(s_models.SustainabilityRecord.paddock_id==p.id).order_by(s_models.SustainabilityRecord.recorded_at.desc()).first()
        if rec:
            html += f"<p>Latest biomass: {rec.dry_biomass_g_m2} g/m2, CO2e {rec.co2e_kg} kg</p>"
    html += "</body></html>"
    return html.encode("utf-8")
