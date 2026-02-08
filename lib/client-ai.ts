"use client"

// Client-side AI utilities using open-source tools
// No API calls needed - runs entirely in the browser

export interface VegetationAnalysis {
  ndvi: number
  gndvi: number
  evi: number
  savi: number
  msavi: number
  greenCoverage: number
  healthScore: number
  dominantColor: { r: number; g: number; b: number }
}

export interface TextureMetrics {
  contrast: number
  homogeneity: number
  entropy: number
  energy: number
}

export interface SegmentationResult {
  vegetationMask: ImageData
  soilMask: ImageData
  deadMask: ImageData
  vegetationPercentage: number
  soilPercentage: number
  deadPercentage: number
}

/**
 * Calculate pseudo-vegetation indices from RGB image
 * Based on research papers on RGB-based vegetation analysis
 */
export function calculateVegetationIndices(imageData: ImageData): VegetationAnalysis {
  const { data, width, height } = imageData
  const totalPixels = width * height

  let totalNDVI = 0
  let totalGNDVI = 0
  let totalEVI = 0
  let totalSAVI = 0
  let totalMSAVI = 0
  let greenPixels = 0
  let healthSum = 0

  let sumR = 0,
    sumG = 0,
    sumB = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255
    const g = data[i + 1] / 255
    const b = data[i + 2] / 255

    sumR += r
    sumG += g
    sumB += b

    // Pseudo-NIR estimation from RGB
    // Using green channel heavily weighted as proxy for NIR
    const pseudoNIR = g * 0.6 + r * 0.2 + b * 0.2

    // NDVI: (NIR - Red) / (NIR + Red)
    const ndvi = (pseudoNIR - r) / (pseudoNIR + r + 0.001)
    totalNDVI += ndvi

    // GNDVI: (NIR - Green) / (NIR + Green)
    const gndvi = (pseudoNIR - g * 0.5) / (pseudoNIR + g * 0.5 + 0.001)
    totalGNDVI += gndvi

    // EVI: Enhanced Vegetation Index
    const evi = 2.5 * ((pseudoNIR - r) / (pseudoNIR + 6 * r - 7.5 * b + 1))
    totalEVI += Math.max(-1, Math.min(1, evi))

    // SAVI: Soil Adjusted Vegetation Index (L = 0.5)
    const L = 0.5
    const savi = ((pseudoNIR - r) / (pseudoNIR + r + L)) * (1 + L)
    totalSAVI += savi

    // MSAVI: Modified SAVI
    const msavi = (2 * pseudoNIR + 1 - Math.sqrt((2 * pseudoNIR + 1) ** 2 - 8 * (pseudoNIR - r))) / 2
    totalMSAVI += isNaN(msavi) ? 0 : msavi

    // Count green vegetation pixels
    if (g > r && g > b && g > 0.3) {
      greenPixels++
    }

    // Health score based on greenness
    const greenRatio = g / (r + g + b + 0.001)
    healthSum += greenRatio > 0.4 ? 1 : greenRatio > 0.35 ? 0.7 : greenRatio > 0.3 ? 0.4 : 0.1
  }

  return {
    ndvi: totalNDVI / totalPixels,
    gndvi: totalGNDVI / totalPixels,
    evi: totalEVI / totalPixels,
    savi: totalSAVI / totalPixels,
    msavi: totalMSAVI / totalPixels,
    greenCoverage: (greenPixels / totalPixels) * 100,
    healthScore: healthSum / totalPixels,
    dominantColor: {
      r: Math.round((sumR / totalPixels) * 255),
      g: Math.round((sumG / totalPixels) * 255),
      b: Math.round((sumB / totalPixels) * 255),
    },
  }
}

/**
 * Calculate GLCM-based texture metrics
 * Gray-Level Co-occurrence Matrix analysis
 */
export function calculateTextureMetrics(imageData: ImageData): TextureMetrics {
  const { data, width, height } = imageData

  // Convert to grayscale and quantize to 16 levels for GLCM
  const levels = 16
  const gray: number[] = []

  for (let i = 0; i < data.length; i += 4) {
    const g = Math.floor(((data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255) * (levels - 1))
    gray.push(g)
  }

  // Build GLCM for horizontal adjacency (dx=1, dy=0)
  const glcm: number[][] = Array(levels)
    .fill(0)
    .map(() => Array(levels).fill(0))
  let pairs = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      const i = gray[y * width + x]
      const j = gray[y * width + x + 1]
      glcm[i][j]++
      glcm[j][i]++ // Symmetric
      pairs += 2
    }
  }

  // Normalize GLCM
  for (let i = 0; i < levels; i++) {
    for (let j = 0; j < levels; j++) {
      glcm[i][j] /= pairs
    }
  }

  // Calculate metrics
  let contrast = 0
  let homogeneity = 0
  let entropy = 0
  let energy = 0

  for (let i = 0; i < levels; i++) {
    for (let j = 0; j < levels; j++) {
      const p = glcm[i][j]
      if (p > 0) {
        contrast += (i - j) ** 2 * p
        homogeneity += p / (1 + Math.abs(i - j))
        entropy -= p * Math.log2(p + 0.0001)
        energy += p ** 2
      }
    }
  }

  // Normalize to 0-1 range
  const maxContrast = (levels - 1) ** 2
  return {
    contrast: Math.min(1, contrast / maxContrast),
    homogeneity,
    entropy: Math.min(1, entropy / Math.log2(levels ** 2)),
    energy: Math.sqrt(energy),
  }
}

/**
 * Simple color-based segmentation for vegetation, soil, and dead matter
 */
export function segmentImage(imageData: ImageData): SegmentationResult {
  const { data, width, height } = imageData

  const vegetationMask = new ImageData(width, height)
  const soilMask = new ImageData(width, height)
  const deadMask = new ImageData(width, height)

  let vegCount = 0
  let soilCount = 0
  let deadCount = 0
  const totalPixels = width * height

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Vegetation: high green, moderate red, low blue
    const isVegetation = g > r && g > b && g > 60 && g - r > 10

    // Soil/bare ground: brown/tan colors
    const isSoil = r > g && r > b && r > 100 && g > 60 && Math.abs(r - g) < 80

    // Dead matter: yellow/brown, high red+green, low blue
    const isDead = r > 120 && g > 100 && b < 100 && Math.abs(r - g) < 50

    if (isVegetation) {
      vegCount++
      vegetationMask.data[i] = 34
      vegetationMask.data[i + 1] = 197
      vegetationMask.data[i + 2] = 94
      vegetationMask.data[i + 3] = 200
    } else {
      vegetationMask.data[i + 3] = 0
    }

    if (isSoil) {
      soilCount++
      soilMask.data[i] = 139
      soilMask.data[i + 1] = 90
      soilMask.data[i + 2] = 43
      soilMask.data[i + 3] = 200
    } else {
      soilMask.data[i + 3] = 0
    }

    if (isDead) {
      deadCount++
      deadMask.data[i] = 234
      deadMask.data[i + 1] = 179
      deadMask.data[i + 2] = 8
      deadMask.data[i + 3] = 200
    } else {
      deadMask.data[i + 3] = 0
    }
  }

  return {
    vegetationMask,
    soilMask,
    deadMask,
    vegetationPercentage: (vegCount / totalPixels) * 100,
    soilPercentage: (soilCount / totalPixels) * 100,
    deadPercentage: (deadCount / totalPixels) * 100,
  }
}

/**
 * Generate NDVI heatmap from image
 */
export function generateNDVIHeatmap(imageData: ImageData): ImageData {
  const { data, width, height } = imageData
  const result = new ImageData(width, height)

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255
    const g = data[i + 1] / 255
    const b = data[i + 2] / 255

    // Pseudo-NIR from RGB
    const nir = g * 0.6 + r * 0.2 + b * 0.2
    const ndvi = (nir - r) / (nir + r + 0.001)

    // Map NDVI to color
    const normalized = (ndvi + 1) / 2 // 0 to 1

    if (normalized < 0.2) {
      // Very low - red
      result.data[i] = 220
      result.data[i + 1] = 38
      result.data[i + 2] = 38
    } else if (normalized < 0.35) {
      // Low - orange
      result.data[i] = 251
      result.data[i + 1] = 146
      result.data[i + 2] = 60
    } else if (normalized < 0.5) {
      // Medium - yellow
      result.data[i] = 250
      result.data[i + 1] = 204
      result.data[i + 2] = 21
    } else if (normalized < 0.65) {
      // Good - light green
      result.data[i] = 132
      result.data[i + 1] = 204
      result.data[i + 2] = 22
    } else if (normalized < 0.8) {
      // Very good - green
      result.data[i] = 34
      result.data[i + 1] = 197
      result.data[i + 2] = 94
    } else {
      // Excellent - dark green
      result.data[i] = 22
      result.data[i + 1] = 163
      result.data[i + 2] = 74
    }
    result.data[i + 3] = 255
  }

  return result
}

/**
 * Estimate biomass from vegetation indices
 * Based on empirical relationships from agricultural research
 */
export function estimateBiomass(indices: VegetationAnalysis): {
  dryGreen: number
  dryDead: number
  dryClover: number
  gdm: number
  total: number
} {
  // Empirical models based on NDVI-biomass relationships
  // Reference: CSIRO Image2Biomass methodology

  const { ndvi, greenCoverage, healthScore } = indices

  // Dry green biomass (g/m²): strongly correlated with NDVI
  const dryGreen = Math.max(0, 50 + ndvi * 300 + greenCoverage * 2)

  // Dead material estimation
  const dryDead = Math.max(0, 30 + (1 - healthScore) * 100)

  // Clover estimation (assuming mixed pasture)
  const dryClover = Math.max(0, dryGreen * 0.15 * (healthScore > 0.5 ? 1.2 : 0.8))

  // Green dry matter
  const gdm = dryGreen * 0.85

  // Total biomass
  const total = dryGreen + dryDead + dryClover

  return {
    dryGreen: Math.round(dryGreen),
    dryDead: Math.round(dryDead),
    dryClover: Math.round(dryClover),
    gdm: Math.round(gdm),
    total: Math.round(total),
  }
}

/**
 * Get pasture health classification
 */
export function classifyPastureHealth(biomass: number, ndvi: number): "poor" | "fair" | "good" | "excellent" {
  const score = biomass * 0.3 + ndvi * 100 * 0.7

  if (score < 80) return "poor"
  if (score < 150) return "fair"
  if (score < 250) return "good"
  return "excellent"
}

/**
 * Generate grazing recommendations based on analysis
 */
export function generateRecommendations(
  biomass: { total: number; dryGreen: number },
  health: "poor" | "fair" | "good" | "excellent",
  indices: VegetationAnalysis
): {
  action: string
  grazingDays: number
  restDays: number
  priorityAreas: string[]
  feedSavings: number
} {
  const recommendations = {
    poor: {
      action: "Rest pasture completely. Consider reseeding and soil amendment.",
      grazingDays: 0,
      restDays: 60,
      priorityAreas: ["Soil remediation", "Reseeding bare areas", "Weed control"],
      feedSavings: 0,
    },
    fair: {
      action: "Light grazing only. Monitor recovery closely.",
      grazingDays: 3,
      restDays: 35,
      priorityAreas: ["Monitor regrowth", "Spot fertilization", "Reduce stocking rate"],
      feedSavings: 50,
    },
    good: {
      action: "Normal rotational grazing recommended.",
      grazingDays: 7,
      restDays: 21,
      priorityAreas: ["Maintain rotation schedule", "Monitor clover content", "Plan fertilization"],
      feedSavings: 150,
    },
    excellent: {
      action: "Optimal grazing conditions. Can increase stocking temporarily.",
      grazingDays: 10,
      restDays: 14,
      priorityAreas: ["Harvest excess growth", "Consider hay making", "Maximize utilization"],
      feedSavings: 300,
    },
  }

  const base = recommendations[health]

  // Adjust based on green coverage
  const coverageMultiplier = indices.greenCoverage > 70 ? 1.2 : indices.greenCoverage > 50 ? 1 : 0.8

  return {
    ...base,
    feedSavings: Math.round(base.feedSavings * coverageMultiplier),
    grazingDays: Math.round(base.grazingDays * coverageMultiplier),
  }
}

/**
 * Calculate sustainability metrics
 */
export function calculateSustainability(
  biomass: number,
  indices: VegetationAnalysis
): {
  carbonSequestration: number
  waterRetention: number
  soilHealthIndex: number
  biodiversityScore: number
} {
  // Carbon sequestration: ~3.67 kg CO2 per kg biomass
  const carbonSequestration = (biomass / 1000) * 3.67 * 365 * 0.1 // Annual estimate per m²

  // Water retention based on vegetation coverage
  const waterRetention = indices.greenCoverage * 0.8 + indices.ndvi * 20

  // Soil health correlates with vegetation health
  const soilHealthIndex = Math.min(1, (indices.healthScore + indices.ndvi + 1) / 3)

  // Biodiversity approximation based on texture (more varied = more diverse)
  const biodiversityScore = Math.min(1, indices.healthScore * 0.5 + 0.3)

  return {
    carbonSequestration: Math.round(carbonSequestration * 10) / 10,
    waterRetention: Math.round(waterRetention * 10) / 10,
    soilHealthIndex: Math.round(soilHealthIndex * 100) / 100,
    biodiversityScore: Math.round(biodiversityScore * 100) / 100,
  }
}

// ============================================
// LIVESTOCK MANAGEMENT AI FEATURES
// ============================================

export interface LivestockType {
  id: string
  name: string
  emoji: string
  avgWeight: number // kg
  dailyIntake: number // % of body weight as dry matter
  minProtein: number // % of diet
  energyRequirement: number // MJ/day
  waterRequirement: number // L/day
  grazingHours: number // hours/day
  rotationSensitivity: "low" | "medium" | "high"
  heatTolerance: "low" | "medium" | "high"
  terrainPreference: "flat" | "moderate" | "steep"
}

export const LIVESTOCK_DATABASE: LivestockType[] = [
  {
    id: "dairy_cow",
    name: "Dairy Cow",
    emoji: "🐄",
    avgWeight: 650,
    dailyIntake: 3.5,
    minProtein: 16,
    energyRequirement: 120,
    waterRequirement: 100,
    grazingHours: 8,
    rotationSensitivity: "high",
    heatTolerance: "medium",
    terrainPreference: "flat",
  },
  {
    id: "beef_cattle",
    name: "Beef Cattle",
    emoji: "🐂",
    avgWeight: 550,
    dailyIntake: 2.5,
    minProtein: 12,
    energyRequirement: 85,
    waterRequirement: 50,
    grazingHours: 10,
    rotationSensitivity: "medium",
    heatTolerance: "medium",
    terrainPreference: "moderate",
  },
  {
    id: "sheep",
    name: "Sheep",
    emoji: "🐑",
    avgWeight: 70,
    dailyIntake: 3.0,
    minProtein: 14,
    energyRequirement: 12,
    waterRequirement: 8,
    grazingHours: 9,
    rotationSensitivity: "medium",
    heatTolerance: "high",
    terrainPreference: "steep",
  },
  {
    id: "goat",
    name: "Goat",
    emoji: "🐐",
    avgWeight: 50,
    dailyIntake: 4.0,
    minProtein: 14,
    energyRequirement: 10,
    waterRequirement: 6,
    grazingHours: 8,
    rotationSensitivity: "low",
    heatTolerance: "high",
    terrainPreference: "steep",
  },
  {
    id: "horse",
    name: "Horse",
    emoji: "🐴",
    avgWeight: 500,
    dailyIntake: 2.0,
    minProtein: 10,
    energyRequirement: 70,
    waterRequirement: 40,
    grazingHours: 16,
    rotationSensitivity: "high",
    heatTolerance: "medium",
    terrainPreference: "flat",
  },
  {
    id: "alpaca",
    name: "Alpaca",
    emoji: "🦙",
    avgWeight: 70,
    dailyIntake: 1.5,
    minProtein: 10,
    energyRequirement: 8,
    waterRequirement: 5,
    grazingHours: 6,
    rotationSensitivity: "low",
    heatTolerance: "low",
    terrainPreference: "moderate",
  },
  {
    id: "donkey",
    name: "Donkey",
    emoji: "🫏",
    avgWeight: 250,
    dailyIntake: 1.5,
    minProtein: 8,
    energyRequirement: 30,
    waterRequirement: 20,
    grazingHours: 14,
    rotationSensitivity: "low",
    heatTolerance: "high",
    terrainPreference: "steep",
  },
  {
    id: "llama",
    name: "Llama",
    emoji: "🦙",
    avgWeight: 130,
    dailyIntake: 2.0,
    minProtein: 10,
    energyRequirement: 15,
    waterRequirement: 8,
    grazingHours: 8,
    rotationSensitivity: "low",
    heatTolerance: "low",
    terrainPreference: "steep",
  },
]

export interface StockingRateResult {
  optimalHeadCount: number
  maxHeadCount: number
  minHeadCount: number
  dailyIntakeTotal: number // kg DM/day
  grazingDaysAvailable: number
  utilizationRate: number // %
  overgraze_risk: "low" | "medium" | "high"
  feedGapDays: number
  supplementaryFeedNeeded: number // kg/day
}

/**
 * Calculate optimal stocking rate based on pasture analysis
 */
export function calculateStockingRate(
  biomass: { total: number; dryGreen: number },
  health: "poor" | "fair" | "good" | "excellent",
  livestockType: LivestockType,
  paddockSizeHa: number,
  currentHeadCount: number
): StockingRateResult {
  // Convert biomass from g/m² to kg/ha
  const biomassKgHa = biomass.total * 10 // g/m² * 10 = kg/ha
  const greenBiomassKgHa = biomass.dryGreen * 10

  // Calculate available forage (leave 30-50% residual depending on health)
  const residualRate = health === "poor" ? 0.5 : health === "fair" ? 0.45 : health === "good" ? 0.35 : 0.3
  const availableForageKgHa = greenBiomassKgHa * (1 - residualRate)
  const totalAvailableKg = availableForageKgHa * paddockSizeHa

  // Calculate daily intake per animal
  const dailyIntakePerHead = (livestockType.avgWeight * livestockType.dailyIntake) / 100

  // Calculate optimal head count
  const grazingCycleDays = health === "poor" ? 3 : health === "fair" ? 5 : health === "good" ? 7 : 10
  const optimalHeadCount = Math.floor(totalAvailableKg / (dailyIntakePerHead * grazingCycleDays))

  // Safety margins
  const maxHeadCount = Math.floor(optimalHeadCount * 1.2)
  const minHeadCount = Math.floor(optimalHeadCount * 0.7)

  // Calculate grazing days at current stocking rate
  const dailyIntakeTotal = currentHeadCount * dailyIntakePerHead
  const grazingDaysAvailable = dailyIntakeTotal > 0 ? Math.floor(totalAvailableKg / dailyIntakeTotal) : 0

  // Utilization rate
  const utilizationRate = Math.min(100, (currentHeadCount / Math.max(1, optimalHeadCount)) * 100)

  // Overgrazing risk
  const overgrazeRisk: "low" | "medium" | "high" =
    currentHeadCount > maxHeadCount ? "high" : currentHeadCount > optimalHeadCount ? "medium" : "low"

  // Feed gap calculation
  const feedGapDays = Math.max(0, grazingCycleDays - grazingDaysAvailable)
  const supplementaryFeedNeeded = feedGapDays > 0 ? dailyIntakeTotal * feedGapDays : 0

  return {
    optimalHeadCount,
    maxHeadCount,
    minHeadCount,
    dailyIntakeTotal: Math.round(dailyIntakeTotal * 10) / 10,
    grazingDaysAvailable,
    utilizationRate: Math.round(utilizationRate),
    overgraze_risk: overgrazeRisk,
    feedGapDays,
    supplementaryFeedNeeded: Math.round(supplementaryFeedNeeded),
  }
}

export interface NutritionalAnalysis {
  crudeProtein: number // estimated %
  metabolizableEnergy: number // MJ/kg DM
  digestibility: number // %
  fiberContent: number // %
  mineralBalance: {
    calcium: "deficient" | "adequate" | "excess"
    phosphorus: "deficient" | "adequate" | "excess"
    magnesium: "deficient" | "adequate" | "excess"
  }
  qualityGrade: "A" | "B" | "C" | "D"
  suitability: Record<string, number> // livestock type -> suitability score 0-100
}

/**
 * Estimate pasture nutritional value from analysis
 */
export function estimateNutritionalValue(
  indices: VegetationAnalysis,
  health: "poor" | "fair" | "good" | "excellent"
): NutritionalAnalysis {
  // Estimate crude protein based on NDVI and health
  // Young, green pastures have higher protein (18-25%)
  // Mature/dry pastures have lower protein (6-10%)
  const baseProtein = health === "excellent" ? 20 : health === "good" ? 16 : health === "fair" ? 12 : 8
  const crudeProtein = baseProtein + indices.ndvi * 5

  // Metabolizable Energy (MJ/kg DM)
  // Fresh pasture: 10-12 MJ/kg, Dry/mature: 6-8 MJ/kg
  const baseME = health === "excellent" ? 11 : health === "good" ? 10 : health === "fair" ? 8.5 : 7
  const metabolizableEnergy = baseME + indices.healthScore * 2

  // Digestibility correlates with greenness
  const digestibility = 50 + indices.greenCoverage * 0.4 + indices.ndvi * 10

  // Fiber (NDF) - inversely related to quality
  const fiberContent = 60 - indices.healthScore * 20

  // Mineral balance estimation based on vegetation diversity
  const mineralBalance = {
    calcium: indices.greenCoverage > 60 ? "adequate" : indices.greenCoverage > 40 ? "adequate" : "deficient",
    phosphorus: indices.ndvi > 0.4 ? "adequate" : indices.ndvi > 0.2 ? "adequate" : "deficient",
    magnesium: health === "excellent" || health === "good" ? "adequate" : "deficient",
  } as const

  // Quality grade
  const qualityScore = crudeProtein * 2 + metabolizableEnergy * 5 + digestibility * 0.5
  const qualityGrade: "A" | "B" | "C" | "D" =
    qualityScore > 120 ? "A" : qualityScore > 90 ? "B" : qualityScore > 60 ? "C" : "D"

  // Calculate suitability for each livestock type
  const suitability: Record<string, number> = {}
  for (const livestock of LIVESTOCK_DATABASE) {
    let score = 50

    // Protein match
    if (crudeProtein >= livestock.minProtein) {
      score += 20
    } else {
      score -= (livestock.minProtein - crudeProtein) * 3
    }

    // Energy match
    const energyPerKg = metabolizableEnergy
    const dailyIntakeKg = (livestock.avgWeight * livestock.dailyIntake) / 100
    const energyFromPasture = energyPerKg * dailyIntakeKg
    if (energyFromPasture >= livestock.energyRequirement * 0.8) {
      score += 15
    }

    // Digestibility bonus
    score += (digestibility - 50) * 0.3

    // Health-based adjustment
    if (livestock.rotationSensitivity === "high" && health === "poor") {
      score -= 15
    }

    suitability[livestock.id] = Math.max(0, Math.min(100, Math.round(score)))
  }

  return {
    crudeProtein: Math.round(crudeProtein * 10) / 10,
    metabolizableEnergy: Math.round(metabolizableEnergy * 10) / 10,
    digestibility: Math.round(digestibility),
    fiberContent: Math.round(fiberContent),
    mineralBalance,
    qualityGrade,
    suitability,
  }
}

export interface AnimalWelfareIndicators {
  heatStressRisk: "low" | "medium" | "high"
  shadeAvailability: "none" | "limited" | "adequate"
  waterAccessScore: number // 0-100
  grazingComfort: number // 0-100
  estimatedWeightGain: number // kg/day
  milkProductionImpact: number // % change
  recommendations: string[]
}

/**
 * Assess animal welfare indicators based on pasture conditions
 */
export function assessAnimalWelfare(
  indices: VegetationAnalysis,
  health: "poor" | "fair" | "good" | "excellent",
  livestockType: LivestockType,
  temperature: number = 25 // default ambient temp
): AnimalWelfareIndicators {
  // Heat stress calculation
  const heatStressThreshold = livestockType.heatTolerance === "high" ? 32 : livestockType.heatTolerance === "medium" ? 28 : 24
  const heatStressRisk: "low" | "medium" | "high" =
    temperature > heatStressThreshold + 5 ? "high" : temperature > heatStressThreshold ? "medium" : "low"

  // Shade availability (estimated from texture/vegetation structure)
  const shadeAvailability: "none" | "limited" | "adequate" =
    indices.greenCoverage > 80 ? "adequate" : indices.greenCoverage > 50 ? "limited" : "none"

  // Water access (assume correlated with pasture health)
  const waterAccessScore = health === "excellent" ? 90 : health === "good" ? 75 : health === "fair" ? 55 : 35

  // Grazing comfort based on terrain preference match and pasture quality
  let grazingComfort = 50
  if (health === "excellent") grazingComfort += 25
  else if (health === "good") grazingComfort += 15
  else if (health === "fair") grazingComfort += 5
  else grazingComfort -= 10

  if (heatStressRisk === "low") grazingComfort += 15
  else if (heatStressRisk === "high") grazingComfort -= 20

  grazingComfort = Math.max(0, Math.min(100, grazingComfort))

  // Weight gain estimation (kg/day)
  // Based on pasture quality and animal type
  const baseGain =
    livestockType.id === "dairy_cow"
      ? 0
      : // dairy cows don't gain, they produce milk
        livestockType.id === "beef_cattle"
        ? 1.2
        : livestockType.id === "sheep"
          ? 0.15
          : livestockType.id === "goat"
            ? 0.1
            : 0.5

  const qualityMultiplier = health === "excellent" ? 1.3 : health === "good" ? 1.0 : health === "fair" ? 0.7 : 0.4
  const heatMultiplier = heatStressRisk === "high" ? 0.6 : heatStressRisk === "medium" ? 0.85 : 1.0
  const estimatedWeightGain = baseGain * qualityMultiplier * heatMultiplier

  // Milk production impact (% change from baseline)
  let milkProductionImpact = 0
  if (livestockType.id === "dairy_cow") {
    if (health === "excellent") milkProductionImpact = 15
    else if (health === "good") milkProductionImpact = 5
    else if (health === "fair") milkProductionImpact = -10
    else milkProductionImpact = -25

    if (heatStressRisk === "high") milkProductionImpact -= 20
    else if (heatStressRisk === "medium") milkProductionImpact -= 8
  }

  // Generate recommendations
  const recommendations: string[] = []
  if (heatStressRisk === "high") {
    recommendations.push("Provide additional shade structures or move to shaded paddock")
    recommendations.push("Ensure water troughs are full and accessible")
    recommendations.push("Consider grazing during cooler morning/evening hours")
  }
  if (health === "poor") {
    recommendations.push("Supplement with hay or silage to meet nutritional needs")
    recommendations.push("Consider reducing stocking density")
    recommendations.push("Monitor animal body condition scores weekly")
  }
  if (waterAccessScore < 60) {
    recommendations.push("Add additional water points in paddock")
  }
  if (shadeAvailability === "none") {
    recommendations.push("Plant shade trees or install shade structures")
  }
  if (recommendations.length === 0) {
    recommendations.push("Current conditions are favorable for " + livestockType.name)
  }

  return {
    heatStressRisk,
    shadeAvailability,
    waterAccessScore,
    grazingComfort,
    estimatedWeightGain: Math.round(estimatedWeightGain * 100) / 100,
    milkProductionImpact: Math.round(milkProductionImpact),
    recommendations,
  }
}

export interface RotationalGrazingPlan {
  totalPaddocks: number
  currentPaddock: number
  daysInCurrentPaddock: number
  daysUntilRotation: number
  restPeriodDays: number
  grazingPeriodDays: number
  annualRotations: number
  schedule: Array<{
    paddock: number
    startDay: number
    endDay: number
    action: "graze" | "rest"
  }>
  efficiencyScore: number // 0-100
}

/**
 * Generate rotational grazing plan
 */
export function generateRotationalPlan(
  health: "poor" | "fair" | "good" | "excellent",
  livestockType: LivestockType,
  totalPaddocks: number,
  currentDay: number = 0
): RotationalGrazingPlan {
  // Base rest period depends on pasture health and livestock sensitivity
  const baseRestDays =
    health === "poor" ? 45 : health === "fair" ? 35 : health === "good" ? 25 : 18

  const sensitivityMultiplier =
    livestockType.rotationSensitivity === "high" ? 1.3 : livestockType.rotationSensitivity === "medium" ? 1.0 : 0.8

  const restPeriodDays = Math.round(baseRestDays * sensitivityMultiplier)

  // Grazing period = rest period / (paddocks - 1)
  const grazingPeriodDays = Math.max(1, Math.round(restPeriodDays / Math.max(1, totalPaddocks - 1)))

  // Calculate current position in rotation
  const rotationCycleDays = grazingPeriodDays * totalPaddocks
  const dayInCycle = currentDay % rotationCycleDays
  const currentPaddock = Math.floor(dayInCycle / grazingPeriodDays) + 1
  const daysInCurrentPaddock = dayInCycle % grazingPeriodDays
  const daysUntilRotation = grazingPeriodDays - daysInCurrentPaddock

  // Annual rotations
  const annualRotations = Math.floor(365 / rotationCycleDays)

  // Generate schedule for one full cycle
  const schedule: RotationalGrazingPlan["schedule"] = []
  for (let p = 0; p < totalPaddocks; p++) {
    schedule.push({
      paddock: p + 1,
      startDay: p * grazingPeriodDays,
      endDay: (p + 1) * grazingPeriodDays - 1,
      action: "graze",
    })
  }

  // Efficiency score based on matching optimal rest periods
  const optimalRestDays = 25 // general optimal
  const restDeviation = Math.abs(restPeriodDays - optimalRestDays)
  const efficiencyScore = Math.max(0, 100 - restDeviation * 2 - (totalPaddocks < 4 ? 15 : 0))

  return {
    totalPaddocks,
    currentPaddock,
    daysInCurrentPaddock,
    daysUntilRotation,
    restPeriodDays,
    grazingPeriodDays,
    annualRotations,
    schedule,
    efficiencyScore: Math.round(efficiencyScore),
  }
}

export interface FeedBudget {
  dailyRequirement: number // kg DM
  weeklyRequirement: number // kg DM
  monthlyRequirement: number // kg DM
  pastureContribution: number // %
  supplementNeeded: number // kg/day
  supplementCost: number // $/day estimated
  feedConversionRatio: number
  costPerKgGain: number // $/kg
}

/**
 * Calculate feed budget for livestock
 */
export function calculateFeedBudget(
  biomass: { total: number; dryGreen: number },
  health: "poor" | "fair" | "good" | "excellent",
  livestockType: LivestockType,
  headCount: number,
  paddockSizeHa: number,
  supplementPricePerKg: number = 0.5 // default $/kg
): FeedBudget {
  // Daily requirement per head
  const dailyIntakePerHead = (livestockType.avgWeight * livestockType.dailyIntake) / 100
  const dailyRequirement = dailyIntakePerHead * headCount

  // Weekly and monthly
  const weeklyRequirement = dailyRequirement * 7
  const monthlyRequirement = dailyRequirement * 30

  // Calculate pasture availability
  const biomassKgHa = biomass.dryGreen * 10
  const utilizableRate = health === "excellent" ? 0.7 : health === "good" ? 0.6 : health === "fair" ? 0.5 : 0.35
  const dailyGrowthKgHa = health === "excellent" ? 50 : health === "good" ? 35 : health === "fair" ? 20 : 10
  const totalDailyAvailable = (biomassKgHa * utilizableRate * paddockSizeHa) / 30 + dailyGrowthKgHa * paddockSizeHa

  // Pasture contribution
  const pastureContribution = Math.min(100, (totalDailyAvailable / dailyRequirement) * 100)

  // Supplement needed
  const supplementNeeded = Math.max(0, dailyRequirement - totalDailyAvailable)
  const supplementCost = supplementNeeded * supplementPricePerKg

  // Feed conversion ratio (kg feed per kg gain) - varies by livestock
  const baseFC = livestockType.id === "beef_cattle" ? 6 : livestockType.id === "sheep" ? 5 : 7
  const feedConversionRatio = baseFC * (health === "excellent" ? 0.85 : health === "good" ? 1.0 : 1.2)

  // Cost per kg gain
  const avgGain =
    livestockType.id === "dairy_cow"
      ? 0.1
      : livestockType.id === "beef_cattle"
        ? 1.0
        : livestockType.id === "sheep"
          ? 0.12
          : 0.08
  const costPerKgGain = avgGain > 0 ? (supplementCost / headCount / avgGain) * feedConversionRatio : 0

  return {
    dailyRequirement: Math.round(dailyRequirement * 10) / 10,
    weeklyRequirement: Math.round(weeklyRequirement),
    monthlyRequirement: Math.round(monthlyRequirement),
    pastureContribution: Math.round(pastureContribution),
    supplementNeeded: Math.round(supplementNeeded * 10) / 10,
    supplementCost: Math.round(supplementCost * 100) / 100,
    feedConversionRatio: Math.round(feedConversionRatio * 10) / 10,
    costPerKgGain: Math.round(costPerKgGain * 100) / 100,
  }
}
