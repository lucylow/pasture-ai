import { generateObject } from "ai"
import { z } from "zod"
import { runServerAnalysis, type ServerAnalysisResult } from "@/lib/server-ai"

// AI enhancement schema -- used to refine open-source results with vision model
const AIRefinementSchema = z.object({
  visual_assessment: z.object({
    pasture_condition: z.enum(["poor", "fair", "good", "excellent"]),
    primary_grass_type: z.string().describe("Most likely dominant grass species"),
    signs_of_stress: z.array(z.string()).describe("Visible stress indicators"),
    ground_cover_estimate: z.number().min(0).max(100),
    image_quality_score: z.number().min(0).max(1).describe("How suitable is this image for pasture analysis"),
  }),
  biomass_adjustment: z.object({
    confidence_in_oss_estimate: z.number().min(0).max(1).describe("How confident are you in the algorithmic biomass estimate"),
    suggested_total_kg_ha: z.number().describe("Your best estimate of total biomass in kg/ha"),
    adjustment_reason: z.string().describe("Why you agree or disagree with the algorithmic estimate"),
  }),
  additional_observations: z.object({
    weed_presence: z.boolean(),
    waterlogging_signs: z.boolean(),
    pest_damage_signs: z.boolean(),
    recent_grazing_evidence: z.boolean(),
    fencing_or_infrastructure: z.boolean(),
    notes: z.string().describe("Additional notes about the pasture condition"),
  }),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File | null
    const imageUrl = formData.get("imageUrl") as string | null
    const mode = (formData.get("mode") as string) || "hybrid"
    // mode: "oss" = open-source only, "hybrid" = open-source + AI refinement, "ai" = AI only

    if (!imageFile && !imageUrl) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    const startTime = Date.now()

    // Step 1: Convert image to base64
    let imageData: string | undefined
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      imageData = `data:${imageFile.type};base64,${buffer.toString("base64")}`
    }

    // Step 2: Run open-source server-side analysis (always runs - fast, no API cost)
    let ossResult: ServerAnalysisResult | null = null
    if (imageData) {
      ossResult = runServerAnalysis(imageData)
    }

    const ossTime = Date.now() - startTime

    // Step 3: Optionally run AI vision refinement
    let aiRefinement = null
    let aiTime = 0

    if (mode !== "oss" && imageData) {
      const aiStart = Date.now()
      try {
        const ossContext = ossResult
          ? `
The open-source algorithmic analysis produced these results:
- Biomass: ${ossResult.biomass.total_kg_ha} kg/ha (green: ${ossResult.biomass.green_kg_ha}, dead: ${ossResult.biomass.dead_kg_ha})
- Health: ${ossResult.health.health} (score: ${ossResult.health.healthScore}/100)
- Vegetation coverage: ${ossResult.coverage.vegetation_pct}%
- NDVI mean: ${ossResult.indices.mean.ndvi.toFixed(3)}
- Detected species: ${ossResult.species.map(s => `${s.name} (${(s.probability * 100).toFixed(0)}%)`).join(", ") || "none"}
- Quality grade: ${ossResult.nutrition.quality_grade}
- Ensemble uncertainty: ${ossResult.biomass.uncertainty.toFixed(2)} (lower is better)

Please verify these algorithmic results using your visual assessment of the image.`
          : ""

        const { object } = await generateObject({
          model: "anthropic/claude-sonnet-4-20250514",
          schema: AIRefinementSchema,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert agricultural AI system. Analyze this pasture image and provide visual assessment to refine algorithmic analysis results.
${ossContext}

Focus on:
1. Visual indicators of pasture health that algorithms might miss
2. Species identification from leaf shape, color patterns, growth habit
3. Signs of stress, disease, weeds, or management issues
4. Whether the algorithmic biomass estimate looks reasonable for what you see

Biomass reference ranges:
- Poor/sparse: 200-600 kg/ha
- Fair: 600-1200 kg/ha  
- Good: 1200-2500 kg/ha
- Excellent/dense: 2500-4500 kg/ha`,
                },
                { type: "image", image: imageData },
              ],
            },
          ],
        })
        aiRefinement = object
        aiTime = Date.now() - aiStart
      } catch (aiError) {
        console.error("AI refinement failed, using OSS results only:", aiError)
      }
    }

    // Step 4: Fuse results
    const totalTime = Date.now() - startTime

    // Build the final response combining OSS + AI
    const fusedBiomass = fuseBiomassEstimates(ossResult, aiRefinement)

    const response = {
      success: true,
      data: {
        // Primary results (fused)
        predictions: {
          dry_green_g: Math.round(fusedBiomass.green / 10), // kg/ha to g/m2
          dry_dead_g: Math.round(fusedBiomass.dead / 10),
          dry_clover_g: Math.round(fusedBiomass.clover / 10),
          gdm_g: Math.round(fusedBiomass.green * 0.85 / 10),
          dry_total_g: Math.round(fusedBiomass.total / 10),
        },
        metrics: {
          biomass_density: Math.round(fusedBiomass.total / 10),
          pasture_health: ossResult?.health.health || aiRefinement?.visual_assessment.pasture_condition || "fair",
          greenness_index: ossResult ? Math.max(0, Math.min(1, (ossResult.indices.mean.ndvi + 1) / 2)) : 0.5,
          coverage_percentage: ossResult?.coverage.vegetation_pct ?? aiRefinement?.visual_assessment.ground_cover_estimate ?? 50,
        },
        recommendations: {
          grazing_recommendation: ossResult?.grazing.recommendation || "Analyze pasture for recommendations.",
          grazing_duration_days: ossResult?.grazing.grazing_days ?? 7,
          rest_period_days: ossResult?.grazing.rest_days ?? 21,
          feed_savings_estimate: ossResult?.grazing.feed_savings_monthly ?? 100,
        },
        sustainability: {
          carbon_sequestration_kg: ossResult?.sustainability.carbon_sequestration_kg_yr ?? 0,
          water_retention_mm: ossResult?.sustainability.water_retention_mm ?? 0,
          soil_health_index: ossResult?.sustainability.soil_health_index ?? 0.5,
        },
        confidence_score: fusedBiomass.confidence,

        // Extended open-source analysis data
        oss_analysis: ossResult ? {
          indices: ossResult.indices,
          biomass: ossResult.biomass,
          health: ossResult.health,
          coverage: ossResult.coverage,
          nutrition: ossResult.nutrition,
          species: ossResult.species,
          feature_vector_summary: {
            ndvi_mean: ossResult.feature_vector.ndvi_mean,
            vegetation_pct: ossResult.feature_vector.vegetation_pct,
            greenness_excess: ossResult.feature_vector.greenness_excess,
            green_ratio: ossResult.feature_vector.green_ratio,
            saturation_mean: ossResult.feature_vector.saturation_mean,
          },
          metadata: ossResult.analysis_metadata,
        } : null,

        // AI visual refinement (if available)
        ai_refinement: aiRefinement,

        // Metadata
        model_version: "v2.0-hybrid-oss",
        analysis_mode: mode,
        processing_time_ms: totalTime,
        oss_processing_ms: ossTime,
        ai_processing_ms: aiTime,
        analyzed_at: new Date().toISOString(),
        engine: {
          oss: "pasture-ai-oss-v2 (12 vegetation indices, 8-model ensemble, species classifier)",
          ai: aiRefinement ? "claude-sonnet-4-20250514" : "none",
          fusion: aiRefinement ? "weighted-average" : "oss-only",
        }
      },
    }

    return Response.json(response)
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json({ error: "Failed to analyze image", details: String(error) }, { status: 500 })
  }
}

/**
 * Fuse open-source and AI biomass estimates using weighted averaging
 * Weights are based on confidence/uncertainty from each source
 */
function fuseBiomassEstimates(
  ossResult: ServerAnalysisResult | null,
  aiRefinement: z.infer<typeof AIRefinementSchema> | null
): { total: number; green: number; dead: number; clover: number; confidence: number } {
  if (!ossResult && !aiRefinement) {
    return { total: 1000, green: 700, dead: 200, clover: 100, confidence: 0.1 }
  }

  if (!aiRefinement || !ossResult) {
    // OSS only
    if (ossResult) {
      return {
        total: ossResult.biomass.total_kg_ha,
        green: ossResult.biomass.green_kg_ha,
        dead: ossResult.biomass.dead_kg_ha,
        clover: ossResult.biomass.clover_kg_ha,
        confidence: Math.min(0.85, ossResult.health.confidence),
      }
    }
    // AI only (shouldn't happen in normal flow)
    const aiTotal = aiRefinement!.biomass_adjustment.suggested_total_kg_ha
    return { total: aiTotal, green: aiTotal * 0.7, dead: aiTotal * 0.2, clover: aiTotal * 0.1, confidence: 0.7 }
  }

  // Hybrid fusion: weight by confidence
  const ossWeight = 1 - ossResult.biomass.uncertainty // Higher certainty = higher weight
  const aiWeight = aiRefinement.biomass_adjustment.confidence_in_oss_estimate

  // If AI agrees with OSS (high confidence in oss estimate), trust OSS more
  // If AI disagrees, blend toward AI suggestion
  const agreementFactor = aiWeight // 0 = AI disagrees, 1 = AI fully agrees

  const ossTotal = ossResult.biomass.total_kg_ha
  const aiTotal = aiRefinement.biomass_adjustment.suggested_total_kg_ha

  // Weighted fusion
  const fusedOssWeight = 0.5 + agreementFactor * 0.3 // 0.5-0.8
  const fusedAiWeight = 1 - fusedOssWeight

  const fusedTotal = Math.round(ossTotal * fusedOssWeight + aiTotal * fusedAiWeight)

  // Scale components proportionally
  const scale = ossTotal > 0 ? fusedTotal / ossTotal : 1

  return {
    total: fusedTotal,
    green: Math.round(ossResult.biomass.green_kg_ha * scale),
    dead: Math.round(ossResult.biomass.dead_kg_ha * scale),
    clover: Math.round(ossResult.biomass.clover_kg_ha * scale),
    confidence: Math.min(0.95, (ossResult.health.confidence + aiWeight) / 2 + 0.1),
  }
}
