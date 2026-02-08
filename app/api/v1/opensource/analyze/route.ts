import { generateObject, generateText } from "ai"
import { z } from "zod"

// Open-source model analysis using free models through AI Gateway
// Supports Llama, Mistral, and other open-source models

const PastureAnalysisSchema = z.object({
  analysis: z.object({
    overall_assessment: z.string().describe("Brief overall assessment of pasture condition"),
    vegetation_quality: z.enum(["poor", "fair", "good", "excellent"]),
    estimated_coverage_percent: z.number().min(0).max(100),
    growth_stage: z.enum(["dormant", "early_growth", "peak_growth", "senescence"]),
    species_diversity: z.enum(["low", "moderate", "high"]),
  }),
  observations: z.object({
    positive_indicators: z.array(z.string()).describe("List of positive observations"),
    concerns: z.array(z.string()).describe("List of concerns or issues"),
    weed_presence: z.boolean(),
    bare_patches_visible: z.boolean(),
    water_stress_signs: z.boolean(),
  }),
  recommendations: z.object({
    immediate_actions: z.array(z.string()),
    grazing_management: z.string(),
    fertilization_advice: z.string(),
    monitoring_frequency: z.string(),
  }),
  ecological_tips: z.array(
    z.object({
      tip: z.string(),
      benefit: z.string(),
      difficulty: z.enum(["easy", "moderate", "advanced"]),
    })
  ),
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const imageFile = formData.get("image") as File | null
    const useVision = formData.get("useVision") === "true"

    // Client-side analysis data passed from the browser
    const clientAnalysis = formData.get("clientAnalysis") as string | null

    let parsedClientAnalysis = null
    if (clientAnalysis) {
      try {
        parsedClientAnalysis = JSON.parse(clientAnalysis)
      } catch {
        // Ignore parse errors
      }
    }

    const startTime = Date.now()

    // Use Llama 3.2 for text analysis (free through AI Gateway)
    // Or Mistral if Llama is not available
    const model = "fireworks/llama-v3p2-11b-vision-instruct"

    let imageData: string | undefined
    if (imageFile && useVision) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      imageData = `data:${imageFile.type};base64,${buffer.toString("base64")}`
    }

    // Build context from client-side analysis
    const clientContext = parsedClientAnalysis
      ? `
Client-side image analysis results:
- NDVI (vegetation index): ${parsedClientAnalysis.ndvi?.toFixed(3) || "N/A"}
- Green coverage: ${parsedClientAnalysis.greenCoverage?.toFixed(1) || "N/A"}%
- Health score: ${parsedClientAnalysis.healthScore?.toFixed(3) || "N/A"}
- Estimated biomass: ${parsedClientAnalysis.biomass?.total || "N/A"} g/m²
- Texture contrast: ${parsedClientAnalysis.texture?.contrast?.toFixed(3) || "N/A"}
- Texture homogeneity: ${parsedClientAnalysis.texture?.homogeneity?.toFixed(3) || "N/A"}
`
      : ""

    const { object: analysis } = await generateObject({
      model,
      schema: PastureAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert agricultural advisor specializing in sustainable pasture management.

${clientContext}

Based on this pasture analysis data, provide:
1. An overall assessment of the pasture condition
2. Key observations (both positive and concerning)
3. Practical recommendations for improvement
4. Ecological tips for sustainable management

Focus on actionable advice that farmers can implement immediately.
Consider soil health, biodiversity, carbon sequestration, and water retention.
${imageData ? "Also analyze the provided image for additional visual cues." : ""}`,
            },
            ...(imageData ? [{ type: "image" as const, image: imageData }] : []),
          ],
        },
      ],
    })

    const processingTime = Date.now() - startTime

    return Response.json({
      success: true,
      data: {
        ...analysis,
        model_used: model,
        model_type: "open-source",
        processing_time_ms: processingTime,
        client_analysis_included: !!parsedClientAnalysis,
        analyzed_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Open-source analysis error:", error)

    // Fallback to text-only model if vision fails
    try {
      const formData = await req.formData()
      const clientAnalysis = formData.get("clientAnalysis") as string | null

      let parsedClientAnalysis = null
      if (clientAnalysis) {
        parsedClientAnalysis = JSON.parse(clientAnalysis)
      }

      const { text } = await generateText({
        model: "fireworks/llama-v3p2-3b-instruct",
        prompt: `Based on pasture analysis showing:
- NDVI: ${parsedClientAnalysis?.ndvi || 0.3}
- Coverage: ${parsedClientAnalysis?.greenCoverage || 50}%
- Health: ${parsedClientAnalysis?.healthScore || 0.5}

Provide brief pasture management advice in JSON format with keys: assessment, recommendations, tips`,
      })

      return Response.json({
        success: true,
        data: {
          raw_response: text,
          model_type: "open-source-fallback",
          analyzed_at: new Date().toISOString(),
        },
      })
    } catch (fallbackError) {
      return Response.json(
        {
          error: "Analysis failed",
          details: String(error),
          fallback_error: String(fallbackError),
        },
        { status: 500 }
      )
    }
  }
}
