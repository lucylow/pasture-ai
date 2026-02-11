/**
 * Regulatory export — PDF/CSV for compliance.
 * Gathers AI mock data and calls backend or generates client-side.
 */
import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  aiModelRegistry,
  modelCard,
  featureAttribution,
  uncertaintyBreakdown,
  modelDriftStatus,
  aiDecisionTrace,
  confidenceTiles,
  optimizationEngineState,
  image2BiomassSnapshot,
} from "@/mock"
import { env } from "@/lib/env"
import { cn } from "@/lib/utils"

const API_BASE = (env.apiBase || "") + "/api/v1/regulatory"

function buildRegulatorySummary() {
  const meanConf =
    confidenceTiles.reduce((a, t) => a + t.confidenceScore, 0) /
    confidenceTiles.length
  return {
    model_registry: aiModelRegistry,
    model_card: modelCard,
    feature_attribution: featureAttribution,
    uncertainty_breakdown: uncertaintyBreakdown,
    model_drift: modelDriftStatus,
    decision_trace: aiDecisionTrace,
    confidence_summary: {
      mean: meanConf.toFixed(2),
      tiles: confidenceTiles,
    },
    biomass_summary: image2BiomassSnapshot.summary,
    optimization: optimizationEngineState,
    exported_at: new Date().toISOString(),
  }
}

function buildGrazingDecisions() {
  const plan = optimizationEngineState.selectedPlan
  return [
    {
      date: plan.grazeStart,
      pasture_id: "PASTURE_07",
      biomass_before: image2BiomassSnapshot.summary.meanBiomass,
      biomass_after: plan.expectedOutcome.utilizationEfficiency * image2BiomassSnapshot.summary.meanBiomass,
      graze_tonnes: "-",
      recovery_days: plan.expectedOutcome.recoveryTimeDays,
      carbon_delta: "-",
    },
  ]
}

export function RegulatoryExportPanel({ className }: { className?: string }) {
  const [loading, setLoading] = useState<"pdf" | "csv" | null>(null)

  const handleExportPDF = async () => {
    setLoading("pdf")
    try {
      const summary = buildRegulatorySummary()
      const res = await fetch(`${API_BASE}/export/regulatory-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || err.hint || res.statusText)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "pastureai_regulatory_report.pdf"
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      // Fallback: client-side CSV of same data when backend unavailable
      const summary = buildRegulatorySummary()
      const text = [
        "PastureAI Regulatory Report",
        "========================",
        "",
        ...Object.entries(summary).flatMap(([k, v]) =>
          typeof v === "object" && v !== null
            ? [k + ":", JSON.stringify(v, null, 0), ""]
            : [k + ": " + String(v), ""]
        ),
      ].join("\n")
      const blob = new Blob([text], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "pastureai_regulatory_report.txt"
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(null)
    }
  }

  const handleExportCSV = async () => {
    setLoading("csv")
    try {
      const decisions = buildGrazingDecisions()
      const res = await fetch(`${API_BASE}/export/grazing-csv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisions }),
      })
      if (!res.ok) throw new Error(res.statusText)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "pastureai_grazing_export.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: client-side CSV
      const decisions = buildGrazingDecisions()
      const headers = [
        "date",
        "pasture_id",
        "biomass_before",
        "biomass_after",
        "graze_tonnes",
        "recovery_days",
        "carbon_delta",
      ]
      const rows = decisions.map((d) =>
        headers.map((h) => String(d[h as keyof typeof d] ?? "")).join(",")
      )
      const csv = [headers.join(","), ...rows].join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "pastureai_grazing_export.csv"
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm",
        className
      )}
    >
      <h4 className="text-xs font-medium text-[#2C2C2A]/60 uppercase tracking-wider mb-3">
        Regulatory Export
      </h4>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleExportPDF}
          disabled={!!loading}
        >
          {loading === "pdf" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Export PDF Report
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={handleExportCSV}
          disabled={!!loading}
        >
          {loading === "csv" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Export Grazing CSV
        </Button>
      </div>
      <p className="text-[10px] text-[#2C2C2A]/50 mt-2">
        Includes model card, uncertainty, drift, decision trace.
      </p>
    </div>
  )
}
