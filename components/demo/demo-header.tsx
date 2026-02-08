"use client"

import { Badge } from "@/components/ui/badge"
import type { Screen } from "./demo-types"

const screenTitles: Record<Screen, string> = {
  upload: "Analyze Pasture",
  livestock: "Livestock Manager",
  history: "Analysis History",
  result: "Analysis Results",
  info: "Model Information",
  settings: "Settings",
}

export function DemoHeader({
  screen,
  onNewPrediction,
}: {
  screen: Screen
  onNewPrediction: () => void
}) {
  return (
    <header className="hidden md:flex px-6 py-3 border-b border-demo-border items-center justify-between bg-demo-surface">
      <h1 className="font-heading font-semibold text-demo-text">
        {screenTitles[screen]}
      </h1>
      <div className="flex items-center gap-3">
        <button
          className="px-4 py-1.5 rounded-lg bg-demo-accent text-white text-sm font-medium hover:bg-demo-accent/90 transition-colors"
          onClick={onNewPrediction}
        >
          New Analysis
        </button>
        <Badge variant="outline" className="border-demo-accent-muted text-demo-accent text-[11px]">
          v2.0
        </Badge>
      </div>
    </header>
  )
}
