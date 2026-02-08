import { runServerAnalysis } from "@/lib/server-ai"

/**
 * Vegetation Indices API - Open Source Only
 * Fast, free endpoint that returns detailed vegetation indices
 * without any AI model API calls.
 *
 * POST /api/indices
 * Body: FormData with "image" file
 *
 * Returns: 12 vegetation indices, coverage stats, species estimates,
 *          biomass prediction with uncertainty, and feature vectors.
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File | null

    if (!imageFile) {
      return Response.json({ error: "No image file provided" }, { status: 400 })
    }

    const startTime = Date.now()

    // Convert to base64
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`

    // Run open-source analysis
    const result = runServerAnalysis(base64)

    const processingTime = Date.now() - startTime

    return Response.json({
      success: true,
      data: {
        vegetation_indices: {
          // Primary indices
          ndvi: round(result.indices.mean.ndvi, 4),
          evi: round(result.indices.mean.evi, 4),
          gndvi: round(result.indices.mean.gndvi, 4),
          savi: round(result.indices.mean.savi, 4),
          msavi: round(result.indices.mean.msavi, 4),
          // RGB-specific indices
          vari: round(result.indices.mean.vari, 4),
          gli: round(result.indices.mean.gli, 4),
          exg: round(result.indices.mean.exg, 4),
          ngrdi: round(result.indices.mean.ngrdi, 4),
          rgbvi: round(result.indices.mean.rgbvi, 4),
          mgrvi: round(result.indices.mean.mgrvi, 4),
          tgi: round(result.indices.mean.tgi, 4),
          // Variability
          ndvi_std: round(result.indices.std.ndvi ?? 0, 4),
        },
        coverage: result.coverage,
        biomass: result.biomass,
        health: {
          classification: result.health.health,
          score: result.health.healthScore,
          confidence: result.health.confidence,
          factors: result.health.factors,
        },
        nutrition: result.nutrition,
        species: result.species,
        sustainability: result.sustainability,
        feature_vector: {
          ndvi_mean: round(result.feature_vector.ndvi_mean, 4),
          evi_mean: round(result.feature_vector.evi_mean, 4),
          gli_mean: round(result.feature_vector.gli_mean, 4),
          vegetation_pct: round(result.feature_vector.vegetation_pct, 2),
          green_ratio: round(result.feature_vector.green_ratio, 4),
          greenness_excess: round(result.feature_vector.greenness_excess, 4),
          brightness: round(result.feature_vector.brightness, 4),
          saturation_mean: round(result.feature_vector.saturation_mean, 4),
          color_variance: round(result.feature_vector.color_variance, 4),
          green_spatial_uniformity: round(result.feature_vector.green_spatial_uniformity, 4),
        },
        metadata: {
          ...result.analysis_metadata,
          processing_time_ms: processingTime,
          analyzed_at: new Date().toISOString(),
          endpoint: "oss-indices-v2",
        },
      },
    })
  } catch (error) {
    console.error("Indices analysis error:", error)
    return Response.json(
      { error: "Failed to compute vegetation indices", details: String(error) },
      { status: 500 }
    )
  }
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
