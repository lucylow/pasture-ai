# app/exports/regulatory_pack.py
"""
Regulatory export pack: CSV + PDF in a single ZIP for compliance submission.
"""
import csv
import io
import tempfile
import zipfile
from pathlib import Path
from typing import Any, Dict, List

from app.exports.csv_export import FIELDS, _alias
from app.exports.pdf_report import generate_regulatory_pdf


def generate_regulatory_pack(
    decisions: List[Dict[str, Any]],
    summary: Dict[str, Any],
    filepath: str | Path,
) -> Path:
    """
    Create ZIP containing pastureai_grazing_export.csv and pastureai_regulatory_report.pdf.
    """
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as zf:
        # CSV
        csv_io = io.StringIO()
        writer = csv.DictWriter(csv_io, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        for d in decisions:
            row = {k: d.get(k, d.get(_alias(k), "")) for k in FIELDS}
            writer.writerow(row)
        zf.writestr("pastureai_grazing_export.csv", csv_io.getvalue())

        # PDF (or txt fallback)
        try:
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                pdf_path = Path(tmp.name)
            generate_regulatory_pdf(summary, pdf_path)
            with open(pdf_path, "rb") as f:
                zf.writestr("pastureai_regulatory_report.pdf", f.read())
            pdf_path.unlink(missing_ok=True)
        except ImportError:
            zf.writestr(
                "pastureai_regulatory_report.txt",
                "PastureAI Grazing & Carbon Report\n" + "=" * 50 + "\n\n"
                + "\n".join(f"{k}: {v}" for k, v in summary.items()),
            )

    return path
