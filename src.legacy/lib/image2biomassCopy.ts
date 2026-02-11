/**
 * Farmer-friendly UX copy and tooltips for Image2Biomass.
 * Plain language, actionable, avoids jargon.
 */

export const biomassCopy = {
  // Tile / map hover
  biomassLabel: "Feed available",
  biomassUnit: "t/ha",
  biomassTooltip: "Dry matter per hectare — how much pasture your stock can graze",
  rangeLabel: "Possible range",
  rangeTooltip: "We're confident the real value falls in this range",
  vegetationLabel: "Pasture condition",
  vegetationLow: "Needs rest — let it recover before grazing",
  vegetationMedium: "Ready for light grazing",
  vegetationHigh: "Good to graze — feed is building",
  confidenceLabel: "Model confidence",
  confidenceTooltip: "How sure the AI is based on image quality and ground checks",

  // Summary stats
  meanBiomassTitle: "Average feed across paddock",
  meanBiomassSubtitle: "Dry matter tonnes per hectare",
  minMaxTitle: "Lowest to highest spots",
  minMaxSubtitle: "Use this to plan where to graze first",

  // Grazing recommendation
  grazePartial: "Graze part of paddock",
  grazeFull: "Graze whole paddock",
  grazeWait: "Wait — let it grow",
  grazeAreaLabel: "Safe to graze",
  grazeTonnesLabel: "Expected take-off",
  recoveryLabel: "Rest before next graze",
  recoveryTooltip: "Days for pasture to bounce back to target",
  rationaleTitle: "Why this recommendation",

  // Counterfactual
  counterfactualTitle: "What if you wait?",
  counterfactualSubtitle: "Sliding to see how biomass grows with more rest",
  delayDaysLabel: "Days to wait",
  scenarioNow: "Graze now",
  scenarioWait7: "Wait 7 days",
  scenarioWait14: "Wait 14 days",

  // Carbon
  carbonTitle: "Carbon impact",
  carbonBaseline: "Before grazing",
  carbonPost: "After grazing",
  carbonChange: "Net change",
  carbonMethodology: "IPCC Tier 2 + biomass proxy",

  // Image quality
  imageQualityTitle: "Image quality",
  cloudCover: "Cloud cover",
  illumination: "Light conditions",
  sensorNoise: "Image clarity",
  alignmentQuality: "Alignment",
  modelConfidenceOverall: "Overall model confidence",
  modelConfidenceByBand: "Per-band confidence",

  // Audit
  auditTitle: "Decision trail",
  auditModelsUsed: "Models used",
  auditInputs: "Inputs",
  auditOutputs: "Outputs",
} as const

export type BiomassCopyKey = keyof typeof biomassCopy
