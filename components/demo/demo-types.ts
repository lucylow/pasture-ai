import type {
  VegetationAnalysis,
  TextureMetrics as ClientTextureMetrics,
  LivestockType,
  StockingRateResult,
  NutritionalAnalysis,
  AnimalWelfareIndicators,
  RotationalGrazingPlan,
  FeedBudget,
} from "@/lib/client-ai"
import type { estimateBiomass, classifyPastureHealth, generateRecommendations, calculateSustainability } from "@/lib/client-ai"
import type { CompleteAnalysisResult } from "@/lib/open-source-ai"

export type Screen = "upload" | "history" | "result" | "info" | "settings" | "livestock"
export type AnalysisMode = "client" | "api" | "hybrid"
export type LivestockTab = "stocking" | "nutrition" | "welfare" | "rotation" | "budget"

export interface VegetationIndices {
  ndvi: number
  gndvi: number
  evi: number
  savi: number
  msavi: number
}

export interface TextureAnalysis {
  glcm_contrast: number
  glcm_homogeneity: number
  entropy: number
  canopy_fragmentation: number
}

export interface SpatialAnalysis {
  dead_zone_pct: number
  healthy_patch_count: number
  bare_soil_pct: number
  edge_density: number
}

export interface TemporalIndicators {
  growth_trend: "declining" | "stable" | "improving"
  recovery_potential: "low" | "moderate" | "high"
  seasonal_stage: "dormant" | "early_growth" | "peak_growth" | "senescence"
}

export interface HistoryEntry {
  id: string
  fileName: string
  date: string
  preview: string
  result: {
    predictions?: Record<string, number>
    metrics?: {
      pasture_health?: string
      coverage_pct?: number
      biomass_density?: number
      greenness_index?: number
    }
    vegetation_indices?: VegetationIndices
    texture_analysis?: TextureAnalysis
    spatial_analysis?: SpatialAnalysis
    temporal_indicators?: TemporalIndicators
    recommendations?: {
      grazing_action?: string
      grazing_days?: number
      rest_days?: number
      priority_areas?: string[]
    }
    confidence_score?: number
    processing_time_ms?: number
    analysis_mode?: string
    client_analysis?: ClientAnalysisResult
    [key: string]: unknown
  }
}

export interface ClientAnalysisResult {
  indices: VegetationAnalysis
  texture: ClientTextureMetrics
  biomass: ReturnType<typeof estimateBiomass>
  health: ReturnType<typeof classifyPastureHealth>
  recommendations: ReturnType<typeof generateRecommendations>
  sustainability: ReturnType<typeof calculateSustainability>
}

export interface LivestockAnalysisState {
  stocking: StockingRateResult | null
  nutrition: NutritionalAnalysis | null
  welfare: AnimalWelfareIndicators | null
  rotation: RotationalGrazingPlan | null
  budget: FeedBudget | null
}

export type { LivestockType, CompleteAnalysisResult }
