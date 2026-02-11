# app/exports/pdf_report.py
"""
Regulatory PDF report for grazing and carbon.
AI model card, uncertainty, drift, decision trace — compliance-grade output.
"""
import json
from pathlib import Path
from typing import Any, Dict, List, Tuple

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas

    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False


def _format_value(val: Any) -> str:
    if isinstance(val, dict):
        return json.dumps(val, indent=0)[:200] + ("..." if len(json.dumps(val)) > 200 else "")
    if isinstance(val, list):
        return ", ".join(str(x) for x in val[:5])
    return str(val)


def _iter_summary_lines(summary: Dict[str, Any]) -> List[Tuple[str, str]]:
    """Flatten summary into (label, value) pairs for PDF."""
    lines: List[Tuple[str, str]] = []
    for key, value in summary.items():
        if key in ("model_registry", "model_card", "feature_attribution", "uncertainty_breakdown",
                   "model_drift", "decision_trace", "confidence_summary", "optimization"):
            if isinstance(value, dict):
                lines.append((f"{key} (summary)", ""))
                for k, v in list(value.items())[:8]:
                    lines.append((f"  {k}", _format_value(v)))
            else:
                lines.append((key, _format_value(value)))
        else:
            lines.append((key, _format_value(value)))
    return lines


def generate_regulatory_pdf(summary: Dict[str, Any], filepath: str | Path) -> Path:
    """
    Generate a regulatory PDF report from a summary dict.
    Handles AI model card, uncertainty, drift, decision trace.
    Requires: pip install reportlab
    """
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)

    if not HAS_REPORTLAB:
        with open(path.with_suffix(".txt"), "w", encoding="utf-8") as f:
            f.write("PastureAI Regulatory Report (AI + Grazing + Carbon)\n")
            f.write("=" * 55 + "\n\n")
            for key, value in summary.items():
                f.write(f"{key}: {_format_value(value)}\n")
        raise ImportError(
            "reportlab is required for PDF export. "
            "Install with: pip install reportlab"
        )

    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4
    margin, line_height = 50, 14

    c.setFont("Helvetica-Bold", 16)
    c.drawString(margin, height - margin, "PastureAI Regulatory Report")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(margin, height - margin - 20, "AI Model Card · Uncertainty · Drift · Decision Trace")

    c.setFont("Helvetica", 9)
    y = height - margin - 50

    for label, value in _iter_summary_lines(summary):
        if y < 60:
            c.showPage()
            y = height - margin
        c.drawString(margin, y, label[:40])
        if value:
            c.setFont("Helvetica-Oblique", 8)
            c.drawString(margin + 120, y, (value[:60] + "..") if len(value) > 60 else value)
            c.setFont("Helvetica", 9)
        y -= line_height

    c.save()
    return path
