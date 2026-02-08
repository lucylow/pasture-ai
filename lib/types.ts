export interface BiomassAnalysis {
  predictions: {
    dry_green_g: number
    dry_dead_g: number
    dry_clover_g: number
    gdm_g: number
    dry_total_g: number
  }
  metrics: {
    biomass_density: number
    pasture_health: "poor" | "fair" | "good" | "excellent"
    greenness_index: number
    coverage_percentage: number
  }
  recommendations: {
    grazing_recommendation: string
    grazing_duration_days: number
    rest_period_days: number
    feed_savings_estimate: number
  }
  sustainability: {
    carbon_sequestration_kg: number
    water_retention_mm: number
    soil_health_index: number
  }
  confidence_score: number
  model_version: string
  processing_time_ms: number
  analyzed_at: string
}

export interface SustainabilityReport {
  carbon_metrics: {
    total_sequestered_kg: number
    monthly_average_kg: number
    carbon_credits_potential: number
    carbon_credit_value_usd: number
  }
  water_metrics: {
    water_saved_liters: number
    retention_improvement_percent: number
    drought_resilience_score: number
  }
  soil_metrics: {
    organic_matter_percent: number
    health_index: number
    erosion_reduction_percent: number
  }
  biodiversity: {
    species_richness_score: number
    pollinator_activity_index: number
    ecosystem_health_rating: "poor" | "fair" | "good" | "excellent"
  }
  economic_impact: {
    feed_cost_savings_monthly: number
    productivity_increase_percent: number
    roi_estimate_percent: number
  }
  recommendations: string[]
  generated_at: string
  period: string
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}
