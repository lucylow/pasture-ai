import { useState } from "react"
import { Link } from "react-router-dom"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Image2BiomassMap,
  BiomassTimeSlider,
  BiomassGrowthCurve,
  CounterfactualSlider,
  GrazingRecommendationCard,
  CarbonImpactCard,
  ImageQualityPanel,
  AuditPreviewCard,
  DemoSimulationLoopBanner,
  MultiPastureOptimizationPanel,
  AuditLogPanel,
  AIExplainabilityPanel,
  AIModelCardPanel,
  LowConfidenceBanner,
  RegulatoryExportPanel,
  AIDemoSimulator,
  useSimulatedValues,
} from "@/components/biomass"
import { image2BiomassSnapshot, aiModelRegistry } from "@/mock"
import { biomassCopy } from "@/lib/image2biomassCopy"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const MOCK_DATES = [
  image2BiomassSnapshot.date,
  "2026-03-05",
  "2026-03-19",
] as const

export function Image2BiomassView() {
  const [activeDate, setActiveDate] = useState(MOCK_DATES[0])
  const [simState, setSimState] = useState({
    timeOffsetDays: 0,
    weather: "sun" as const,
  })
  const [showCarbonOverlay, setShowCarbonOverlay] = useState(true)
  const { meanConfidence, meanBiomass } = useSimulatedValues(simState)

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        height: "100vh",
        background: "#F6F5F2",
      }}
    >
      {/* LEFT PANEL */}
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-4">
            <Link
              to="/map"
              className="text-sm text-[#2C2C2A]/70 hover:underline mb-2 inline-block"
            >
              ← Back to Map
            </Link>
            <h2 className="text-xl font-bold text-[#2C2C2A] mb-1">
              Real-Time Biomass
            </h2>
            <Badge variant="secondary" className="text-[10px] mb-2">
              {aiModelRegistry.image2Biomass.modelId} ·{" "}
              {aiModelRegistry.image2Biomass.architecture}
            </Badge>
            <p className="text-sm text-[#2C2C2A]/80 mb-4">
              Live pasture biomass from satellite imagery, fused with temporal
              growth models.
            </p>

            <div className="mb-3">
              <strong className="text-[#2C2C2A]">{biomassCopy.meanBiomassTitle}</strong>
              <br />
              <span className="text-lg">{meanBiomass.toFixed(2)} t/ha</span>
            </div>

            <div className="mb-3">
              <strong className="text-[#2C2C2A]">{biomassCopy.confidenceLabel}</strong>
              <br />
              <span
                className={
                  meanConfidence < 0.75
                    ? "text-amber-600 font-medium"
                    : meanConfidence < 0.85
                      ? "text-amber-700"
                      : ""
                }
              >
                {meanConfidence < 0.75
                  ? "Low"
                  : meanConfidence < 0.85
                    ? "Moderate"
                    : "High"}{" "}
                ({meanConfidence.toFixed(2)})
              </span>
            </div>

            <LowConfidenceBanner confidence={meanConfidence} />

            <div>
              <strong className="text-[#2C2C2A] block mb-2">Time</strong>
              <BiomassTimeSlider
                dates={[...MOCK_DATES]}
                active={activeDate}
                onChange={setActiveDate}
              />
            </div>

            <AIDemoSimulator state={simState} onStateChange={setSimState} />

            <DemoSimulationLoopBanner className="mb-2" />

            <BiomassGrowthCurve />
            <GrazingRecommendationCard />
            <CounterfactualSlider />
            <CarbonImpactCard />
            <ImageQualityPanel />
            <AuditPreviewCard />
            <AuditLogPanel />
            <MultiPastureOptimizationPanel />

            <div className="flex items-center justify-between rounded-xl border border-[#2C2C2A]/10 bg-white p-4 shadow-sm">
              <Label htmlFor="carbon-toggle" className="text-sm text-[#2C2C2A]">
                Carbon / soil recovery overlay
              </Label>
              <Switch
                id="carbon-toggle"
                checked={showCarbonOverlay}
                onCheckedChange={setShowCarbonOverlay}
              />
            </div>

            <AIExplainabilityPanel />
            <AIModelCardPanel />
            <RegulatoryExportPanel />
          </div>
        </ScrollArea>
      </div>

      {/* MAP */}
      <div className="relative">
        <Image2BiomassMap showCarbonOverlay={showCarbonOverlay} />
      </div>
    </div>
  )
}
