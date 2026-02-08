import { generateObject } from "ai"
import { z } from "zod"

const AdvancedPredictionSchema = z.object({
  predictions: z.object({
    dry_green_g: z.number(),
    dry_dead_g: z.number(),
    dry_clover_g: z.number(),
    gdm_g: z.number(),
    dry_total_g: z.number(),
  }),
  metrics: z.object({
    biomass_density: z.number(),
    pasture_health: z.enum(["poor", "fair", "good", "excellent"]),
    greenness_index: z.number(),
    coverage_pct: z.number(),
  }),
  vegetation_indices: z.object({
    ndvi: z.number().min(-1).max(1).describe("Normalized Difference Vegetation Index"),
    gndvi: z.number().min(-1).max(1).describe("Green NDVI using green band"),
    evi: z.number().min(-1).max(1).describe("Enhanced Vegetation Index"),
    savi: z.number().min(-1).max(1).describe("Soil-Adjusted Vegetation Index"),
    msavi: z.number().min(-1).max(1).describe("Modified SAVI"),
  }),
  texture_analysis: z.object({
    glcm_contrast: z.number().min(0).max(1).describe("GLCM contrast metric"),
    glcm_homogeneity: z.number().min(0).max(1).describe("GLCM homogeneity metric"),
    entropy: z.number().min(0).max(1).describe("Patch entropy"),
    canopy_fragmentation: z.number().min(0).max(1).describe("Canopy fragmentation index"),
  }),
  spatial_analysis: z.object({
    dead_zone_pct: z.number().min(0).max(100).describe("Percentage of dead zones"),
    healthy_patch_count: z.number().describe("Number of healthy vegetation patches"),
    bare_soil_pct: z.number().min(0).max(100).describe("Percentage of bare soil"),
    edge_density: z.number().min(0).max(1).describe("Edge density metric"),
  }),
  temporal_indicators: z.object({
    growth_trend: z.enum(["declining", "stable", "improving"]),
    recovery_potential: z.enum(["low", "moderate", "high"]),
    seasonal_stage: z.enum(["dormant", "early_growth", "peak_growth", "senescence"]),
  }),
  recommendations: z.object({
    grazing_action: z.string(),
    grazing_days: z.number(),
    rest_days: z.number(),
    priority_areas: z.array(z.string()),
  }),
  livestock_analysis: z.object({
    carrying_capacity_au_ha: z.number().describe("Animal Units per hectare capacity"),
    optimal_species: z.array(z.string()).describe("Best suited livestock species"),
    forage_quality_grade: z.enum(["A", "B", "C", "D"]).describe("Overall forage quality"),
    estimated_crude_protein: z.number().describe("Estimated crude protein %"),
    estimated_energy_mj: z.number().describe("Metabolizable energy MJ/kg DM"),
    grazing_suitability: z.object({
      dairy_cattle: z.number().min(0).max(100),
      beef_cattle: z.number().min(0).max(100),
      sheep: z.number().min(0).max(100),
      goats: z.number().min(0).max(100),
      horses: z.number().min(0).max(100),
    }),
    welfare_considerations: z.array(z.string()).describe("Animal welfare notes"),
    rotational_grazing_notes: z.string().describe("Rotation recommendations"),
  }),
  confidence_score: z.number(),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`

    const startTime = Date.now()

    const { object: result } = await generateObject({
      model: "anthropic/claude-sonnet-4-20250514",
      schema: AdvancedPredictionSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an advanced agricultural AI system with expertise in remote sensing, pasture analysis, and livestock management.

Analyze this pasture image and provide comprehensive metrics including:

1. BIOMASS PREDICTIONS (g/m²):
   - dry_green_g: Living green vegetation (50-400)
   - dry_dead_g: Dead organic material (10-150)
   - dry_clover_g: Clover content (0-80)
   - gdm_g: Green dry matter (40-350)
   - dry_total_g: Total biomass (60-500)

2. VEGETATION INDICES (simulate from RGB analysis):
   - NDVI: -1 to 1, healthy vegetation > 0.4
   - GNDVI: Green-based NDVI, often more sensitive
   - EVI: Enhanced index, -1 to 1
   - SAVI: Soil-adjusted, accounts for bare ground
   - MSAVI: Modified SAVI for sparse vegetation

3. TEXTURE ANALYSIS (0-1 scale):
   - GLCM contrast: Texture variation
   - GLCM homogeneity: Uniformity
   - Entropy: Information content
   - Canopy fragmentation: Patchiness

4. SPATIAL ANALYSIS:
   - Dead zone percentage
   - Healthy patch count
   - Bare soil percentage
   - Edge density (boundary complexity)

5. TEMPORAL INDICATORS:
   - Growth trend based on apparent vitality
   - Recovery potential
   - Seasonal growth stage

6. RECOMMENDATIONS:
   - Specific grazing action
   - Optimal grazing and rest periods
   - Priority areas to address

7. LIVESTOCK ANALYSIS:
   - carrying_capacity_au_ha: Animal Units per hectare this pasture can support (0.5-3.0 typical)
   - optimal_species: Which livestock are best suited (e.g., "Beef Cattle", "Sheep", "Dairy Cattle", "Goats", "Horses")
   - forage_quality_grade: A (excellent), B (good), C (fair), D (poor)
   - estimated_crude_protein: Crude protein percentage (6-25%)
   - estimated_energy_mj: Metabolizable energy in MJ/kg dry matter (6-12)
   - grazing_suitability: Score 0-100 for each livestock type based on pasture characteristics
   - welfare_considerations: List any welfare concerns (shade, water, heat stress, terrain)
   - rotational_grazing_notes: Specific rotation recommendations for this pasture condition

Provide realistic, scientifically-grounded estimates based on visual cues in the image.`,
            },
            { type: "image", image: base64Image },
          ],
        },
      ],
    })

    const processingTime = Date.now() - startTime

    return Response.json({
      ...result,
      processing_time_ms: processingTime,
      model_version: "v2.0-advanced",
      analyzed_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return Response.json({ error: "Failed to analyze image", details: String(error) }, { status: 500 })
  }
}
