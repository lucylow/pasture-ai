/**
 * Design review mocks: All Image2Biomass panels in one view.
 * Use for design handoff and stakeholder demos.
 */
import type { Meta, StoryObj } from "@storybook/react"
import { BiomassGrowthCurve } from "./BiomassGrowthCurve"
import { GrazingRecommendationCard } from "./GrazingRecommendationCard"
import { CounterfactualSlider } from "./CounterfactualSlider"
import { CarbonImpactCard } from "./CarbonImpactCard"
import { ImageQualityPanel } from "./ImageQualityPanel"
import { AuditPreviewCard } from "./AuditPreviewCard"
import { MultiPastureOptimizationPanel } from "./MultiPastureOptimizationPanel"
import { AuditLogPanel } from "./AuditLogPanel"
import { image2BiomassSnapshot } from "@/mock/image2biomassTiles"
import { biomassCopy } from "@/lib/image2biomassCopy"

const meta: Meta = {
  title: "Image2Biomass/Mocks/DesignReview",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Pitch-demo mode: all Image2Biomass panels for investor/stakeholder review.",
      },
    },
  },
}

export default meta

type Story = StoryObj

export const AllPanels: Story = {
  render: () => (
    <div className="max-w-md space-y-4 p-6 bg-[#F6F5F2] rounded-xl">
      <div className="text-xl font-bold text-[#2C2C2A] mb-2">Image2Biomass Design Review</div>
      <p className="text-sm text-[#2C2C2A]/80 mb-4">
        Full mock data: tiles, timeline, grazing rec, counterfactual, carbon, quality, audit.
      </p>

      <div className="rounded-xl border bg-white p-4">
        <p className="text-xs text-[#2C2C2A]/60 mb-1">{biomassCopy.meanBiomassTitle}</p>
        <p className="text-2xl font-bold">{image2BiomassSnapshot.summary.meanBiomass} t/ha</p>
      </div>

      <BiomassGrowthCurve />
      <GrazingRecommendationCard />
      <CounterfactualSlider />
      <div className="grid grid-cols-2 gap-4">
        <CarbonImpactCard />
        <ImageQualityPanel />
      </div>
      <AuditPreviewCard />
      <MultiPastureOptimizationPanel />
      <AuditLogPanel />
    </div>
  ),
}
