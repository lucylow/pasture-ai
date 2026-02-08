import { generateObject } from "ai"
import { z } from "zod"

const SustainabilityReportSchema = z.object({
  carbon_metrics: z.object({
    total_sequestered_kg: z.number(),
    monthly_average_kg: z.number(),
    carbon_credits_potential: z.number(),
    carbon_credit_value_usd: z.number(),
  }),
  water_metrics: z.object({
    water_saved_liters: z.number(),
    retention_improvement_percent: z.number(),
    drought_resilience_score: z.number().min(0).max(100),
  }),
  soil_metrics: z.object({
    organic_matter_percent: z.number(),
    health_index: z.number().min(0).max(1),
    erosion_reduction_percent: z.number(),
  }),
  biodiversity: z.object({
    species_richness_score: z.number().min(0).max(100),
    pollinator_activity_index: z.number().min(0).max(1),
    ecosystem_health_rating: z.enum(["poor", "fair", "good", "excellent"]),
  }),
  economic_impact: z.object({
    feed_cost_savings_monthly: z.number(),
    productivity_increase_percent: z.number(),
    roi_estimate_percent: z.number(),
  }),
  recommendations: z.array(z.string()).describe("List of actionable sustainability recommendations"),
})

export async function POST(req: Request) {
  try {
    const { farmSize, analysisHistory, location } = await req.json()

    const { object: report } = await generateObject({
      model: "anthropic/claude-sonnet-4-20250514",
      schema: SustainabilityReportSchema,
      prompt: `Generate a comprehensive sustainability report for a farm with the following details:

Farm Size: ${farmSize || 100} hectares
Location: ${location || "Australia"}
Analysis History: ${analysisHistory ? JSON.stringify(analysisHistory) : "New user - use typical values"}

Provide realistic sustainability metrics based on:
1. Typical pasture carbon sequestration rates (3-5 tonnes CO₂/hectare/year)
2. Water retention improvements from healthy pastures (15-30%)
3. Soil health improvements from rotational grazing
4. Economic benefits of optimized grazing management

Generate actionable recommendations for improving sustainability metrics.`,
    })

    return Response.json({
      success: true,
      data: {
        ...report,
        generated_at: new Date().toISOString(),
        period: "monthly",
      },
    })
  } catch (error) {
    console.error("Sustainability report error:", error)
    return Response.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
