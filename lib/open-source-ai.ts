/**
 * PastureAI - Open Source AI Module
 * 
 * This module provides advanced image analysis using open-source algorithms
 * that run entirely in the browser without requiring external API calls.
 * 
 * Features:
 * - K-means clustering for vegetation segmentation
 * - LAB color space analysis for accurate vegetation detection
 * - Gabor filter-based texture analysis
 * - Morphological operations for mask refinement
 * - Histogram-based feature extraction
 * - Species classification using color signatures
 * - Machine learning-ready feature vectors
 */

// ============================================
// COLOR SPACE CONVERSIONS
// ============================================

export interface LABColor {
  L: number // Lightness: 0-100
  a: number // Green-Red: -128 to 127
  b: number // Blue-Yellow: -128 to 127
}

export interface HSVColor {
  h: number // Hue: 0-360
  s: number // Saturation: 0-1
  v: number // Value: 0-1
}

/**
 * Convert RGB to LAB color space
 * LAB is perceptually uniform and better for vegetation analysis
 */
export function rgbToLab(r: number, g: number, b: number): LABColor {
  // Normalize RGB to 0-1
  let rn = r / 255
  let gn = g / 255
  let bn = b / 255

  // Apply gamma correction
  rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92
  gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92
  bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92

  // Convert to XYZ
  const x = (rn * 0.4124564 + gn * 0.3575761 + bn * 0.1804375) / 0.95047
  const y = (rn * 0.2126729 + gn * 0.7151522 + bn * 0.0721750)
  const z = (rn * 0.0193339 + gn * 0.1191920 + bn * 0.9503041) / 1.08883

  // Convert XYZ to LAB
  const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + 16/116
  const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + 16/116
  const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + 16/116

  return {
    L: (116 * fy) - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz)
  }
}

/**
 * Convert RGB to HSV color space
 */
export function rgbToHsv(r: number, g: number, b: number): HSVColor {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min

  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h * 360, s, v }
}

// ============================================
// K-MEANS CLUSTERING FOR SEGMENTATION
// ============================================

export interface KMeansResult {
  labels: number[]
  centroids: number[][]
  iterations: number
  inertia: number
}

/**
 * K-means clustering algorithm for image segmentation
 * Uses LAB color space for better perceptual clustering
 */
export function kMeansClustering(
  data: number[][], // Array of [L, a, b] or [r, g, b] values
  k: number,
  maxIterations: number = 100,
  tolerance: number = 0.001
): KMeansResult {
  const n = data.length
  const dim = data[0].length

  // Initialize centroids using k-means++ algorithm
  const centroids: number[][] = []
  const usedIndices = new Set<number>()

  // First centroid is random
  const firstIdx = Math.floor(Math.random() * n)
  centroids.push([...data[firstIdx]])
  usedIndices.add(firstIdx)

  // Remaining centroids using weighted probability
  for (let c = 1; c < k; c++) {
    const distances: number[] = []
    let totalDist = 0

    for (let i = 0; i < n; i++) {
      let minDist = Infinity
      for (const centroid of centroids) {
        const dist = euclideanDistance(data[i], centroid)
        minDist = Math.min(minDist, dist)
      }
      distances.push(minDist * minDist)
      totalDist += minDist * minDist
    }

    // Weighted random selection
    let rand = Math.random() * totalDist
    for (let i = 0; i < n; i++) {
      rand -= distances[i]
      if (rand <= 0 && !usedIndices.has(i)) {
        centroids.push([...data[i]])
        usedIndices.add(i)
        break
      }
    }
  }

  // Ensure we have k centroids
  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * n)
    if (!usedIndices.has(idx)) {
      centroids.push([...data[idx]])
      usedIndices.add(idx)
    }
  }

  let labels = new Array(n).fill(0)
  let iterations = 0
  let inertia = 0

  for (iterations = 0; iterations < maxIterations; iterations++) {
    // Assign points to nearest centroid
    const newLabels = new Array(n).fill(0)
    inertia = 0

    for (let i = 0; i < n; i++) {
      let minDist = Infinity
      let minIdx = 0

      for (let c = 0; c < k; c++) {
        const dist = euclideanDistance(data[i], centroids[c])
        if (dist < minDist) {
          minDist = dist
          minIdx = c
        }
      }

      newLabels[i] = minIdx
      inertia += minDist * minDist
    }

    // Check for convergence
    let changed = false
    for (let i = 0; i < n; i++) {
      if (labels[i] !== newLabels[i]) {
        changed = true
        break
      }
    }

    labels = newLabels

    if (!changed) break

    // Update centroids
    const sums: number[][] = Array(k).fill(null).map(() => Array(dim).fill(0))
    const counts = new Array(k).fill(0)

    for (let i = 0; i < n; i++) {
      const label = labels[i]
      counts[label]++
      for (let d = 0; d < dim; d++) {
        sums[label][d] += data[i][d]
      }
    }

    let maxShift = 0
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        for (let d = 0; d < dim; d++) {
          const newVal = sums[c][d] / counts[c]
          maxShift = Math.max(maxShift, Math.abs(centroids[c][d] - newVal))
          centroids[c][d] = newVal
        }
      }
    }

    if (maxShift < tolerance) break
  }

  return { labels, centroids, iterations, inertia }
}

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2
  }
  return Math.sqrt(sum)
}

// ============================================
// ADVANCED VEGETATION SEGMENTATION
// ============================================

export interface AdvancedSegmentationResult {
  vegetationMask: Uint8Array
  soilMask: Uint8Array
  deadMatterMask: Uint8Array
  waterMask: Uint8Array
  shadowMask: Uint8Array
  clusterMap: Uint8Array
  statistics: {
    vegetationPercent: number
    soilPercent: number
    deadPercent: number
    waterPercent: number
    shadowPercent: number
    clusterCentroids: number[][]
    dominantVegetationColor: LABColor
  }
}

/**
 * Advanced image segmentation using LAB color space and k-means
 */
export function advancedSegmentation(
  imageData: ImageData,
  numClusters: number = 5
): AdvancedSegmentationResult {
  const { data, width, height } = imageData
  const totalPixels = width * height

  // Convert image to LAB color space
  const labData: number[][] = []
  for (let i = 0; i < data.length; i += 4) {
    const lab = rgbToLab(data[i], data[i + 1], data[i + 2])
    labData.push([lab.L, lab.a, lab.b])
  }

  // Perform k-means clustering
  const { labels, centroids } = kMeansClustering(labData, numClusters)

  // Classify clusters based on LAB values
  const clusterTypes: string[] = []
  for (const centroid of centroids) {
    const [L, a, b] = centroid
    
    // Vegetation: negative 'a' (green), positive 'b' (yellow-green)
    // Soil: positive 'a' and 'b' (reddish-brown)
    // Dead matter: neutral 'a', positive 'b' (yellow-brown)
    // Water: low 'L', negative 'a' and 'b' (dark blue)
    // Shadow: very low 'L'
    
    if (L < 20) {
      clusterTypes.push("shadow")
    } else if (a < -10 && b > -10) {
      clusterTypes.push("vegetation")
    } else if (a > 5 && b > 15) {
      clusterTypes.push("soil")
    } else if (a > -5 && a < 10 && b > 20) {
      clusterTypes.push("dead")
    } else if (L < 40 && a < 0 && b < 0) {
      clusterTypes.push("water")
    } else if (a < 0) {
      clusterTypes.push("vegetation")
    } else {
      clusterTypes.push("other")
    }
  }

  // Create masks
  const vegetationMask = new Uint8Array(totalPixels)
  const soilMask = new Uint8Array(totalPixels)
  const deadMatterMask = new Uint8Array(totalPixels)
  const waterMask = new Uint8Array(totalPixels)
  const shadowMask = new Uint8Array(totalPixels)
  const clusterMap = new Uint8Array(totalPixels)

  let vegCount = 0, soilCount = 0, deadCount = 0, waterCount = 0, shadowCount = 0

  for (let i = 0; i < totalPixels; i++) {
    const label = labels[i]
    const type = clusterTypes[label]
    clusterMap[i] = label

    switch (type) {
      case "vegetation":
        vegetationMask[i] = 255
        vegCount++
        break
      case "soil":
        soilMask[i] = 255
        soilCount++
        break
      case "dead":
        deadMatterMask[i] = 255
        deadCount++
        break
      case "water":
        waterMask[i] = 255
        waterCount++
        break
      case "shadow":
        shadowMask[i] = 255
        shadowCount++
        break
    }
  }

  // Find dominant vegetation color
  let vegCentroid: number[] = [50, -20, 20] // Default green
  for (let i = 0; i < centroids.length; i++) {
    if (clusterTypes[i] === "vegetation") {
      vegCentroid = centroids[i]
      break
    }
  }

  return {
    vegetationMask,
    soilMask,
    deadMatterMask,
    waterMask,
    shadowMask,
    clusterMap,
    statistics: {
      vegetationPercent: (vegCount / totalPixels) * 100,
      soilPercent: (soilCount / totalPixels) * 100,
      deadPercent: (deadCount / totalPixels) * 100,
      waterPercent: (waterCount / totalPixels) * 100,
      shadowPercent: (shadowCount / totalPixels) * 100,
      clusterCentroids: centroids,
      dominantVegetationColor: { L: vegCentroid[0], a: vegCentroid[1], b: vegCentroid[2] }
    }
  }
}

// ============================================
// MORPHOLOGICAL OPERATIONS
// ============================================

/**
 * Apply morphological erosion to a binary mask
 */
export function erodeMask(mask: Uint8Array, width: number, height: number, kernelSize: number = 3): Uint8Array {
  const result = new Uint8Array(mask.length)
  const half = Math.floor(kernelSize / 2)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minVal = 255
      
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const ny = y + ky
          const nx = x + kx
          
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            minVal = Math.min(minVal, mask[ny * width + nx])
          } else {
            minVal = 0
          }
        }
      }
      
      result[y * width + x] = minVal
    }
  }

  return result
}

/**
 * Apply morphological dilation to a binary mask
 */
export function dilateMask(mask: Uint8Array, width: number, height: number, kernelSize: number = 3): Uint8Array {
  const result = new Uint8Array(mask.length)
  const half = Math.floor(kernelSize / 2)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxVal = 0
      
      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const ny = y + ky
          const nx = x + kx
          
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            maxVal = Math.max(maxVal, mask[ny * width + nx])
          }
        }
      }
      
      result[y * width + x] = maxVal
    }
  }

  return result
}

/**
 * Morphological opening (erosion followed by dilation)
 * Removes small bright spots
 */
export function openingMask(mask: Uint8Array, width: number, height: number, kernelSize: number = 3): Uint8Array {
  const eroded = erodeMask(mask, width, height, kernelSize)
  return dilateMask(eroded, width, height, kernelSize)
}

/**
 * Morphological closing (dilation followed by erosion)
 * Fills small dark holes
 */
export function closingMask(mask: Uint8Array, width: number, height: number, kernelSize: number = 3): Uint8Array {
  const dilated = dilateMask(mask, width, height, kernelSize)
  return erodeMask(dilated, width, height, kernelSize)
}

// ============================================
// GABOR FILTER FOR TEXTURE ANALYSIS
// ============================================

export interface GaborFeatures {
  energy: number[]
  meanAmplitude: number[]
  variance: number[]
  dominantOrientation: number
  textureHomogeneity: number
}

/**
 * Generate Gabor filter kernel
 */
function generateGaborKernel(
  size: number,
  sigma: number,
  theta: number,
  lambda: number,
  gamma: number,
  psi: number
): number[][] {
  const kernel: number[][] = []
  const half = Math.floor(size / 2)

  for (let y = -half; y <= half; y++) {
    const row: number[] = []
    for (let x = -half; x <= half; x++) {
      const xTheta = x * Math.cos(theta) + y * Math.sin(theta)
      const yTheta = -x * Math.sin(theta) + y * Math.cos(theta)
      
      const gaussian = Math.exp(-(xTheta * xTheta + gamma * gamma * yTheta * yTheta) / (2 * sigma * sigma))
      const sinusoid = Math.cos(2 * Math.PI * xTheta / lambda + psi)
      
      row.push(gaussian * sinusoid)
    }
    kernel.push(row)
  }

  return kernel
}

/**
 * Apply Gabor filter bank for texture analysis
 */
export function gaborTextureAnalysis(
  imageData: ImageData,
  numOrientations: number = 4,
  numScales: number = 2
): GaborFeatures {
  const { data, width, height } = imageData
  
  // Convert to grayscale
  const gray = new Float32Array(width * height)
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
  }

  const energies: number[] = []
  const meanAmplitudes: number[] = []
  const variances: number[] = []

  // Apply Gabor filters at different orientations and scales
  for (let s = 0; s < numScales; s++) {
    const sigma = 2 + s * 2
    const lambda = sigma * 2

    for (let o = 0; o < numOrientations; o++) {
      const theta = (o * Math.PI) / numOrientations
      const kernel = generateGaborKernel(Math.ceil(sigma * 6) | 1, sigma, theta, lambda, 0.5, 0)
      
      // Convolve
      const response = convolve2D(gray, width, height, kernel)
      
      // Calculate features
      let sum = 0, sumSq = 0
      for (let i = 0; i < response.length; i++) {
        const val = Math.abs(response[i])
        sum += val
        sumSq += val * val
      }
      
      const mean = sum / response.length
      const energy = sumSq / response.length
      const variance = energy - mean * mean
      
      energies.push(energy)
      meanAmplitudes.push(mean)
      variances.push(Math.max(0, variance))
    }
  }

  // Find dominant orientation
  let maxEnergy = 0
  let dominantOrientation = 0
  for (let i = 0; i < numOrientations; i++) {
    if (energies[i] > maxEnergy) {
      maxEnergy = energies[i]
      dominantOrientation = (i * 180) / numOrientations
    }
  }

  // Calculate texture homogeneity (low variance = more homogeneous)
  const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length
  const textureHomogeneity = Math.exp(-avgVariance * 10)

  return {
    energy: energies,
    meanAmplitude: meanAmplitudes,
    variance: variances,
    dominantOrientation,
    textureHomogeneity
  }
}

/**
 * 2D convolution helper
 */
function convolve2D(
  input: Float32Array,
  width: number,
  height: number,
  kernel: number[][]
): Float32Array {
  const output = new Float32Array(input.length)
  const kHeight = kernel.length
  const kWidth = kernel[0].length
  const kHalfH = Math.floor(kHeight / 2)
  const kHalfW = Math.floor(kWidth / 2)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      
      for (let ky = 0; ky < kHeight; ky++) {
        for (let kx = 0; kx < kWidth; kx++) {
          const ny = y + ky - kHalfH
          const nx = x + kx - kHalfW
          
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            sum += input[ny * width + nx] * kernel[ky][kx]
          }
        }
      }
      
      output[y * width + x] = sum
    }
  }

  return output
}

// ============================================
// HISTOGRAM-BASED FEATURES
// ============================================

export interface HistogramFeatures {
  colorHistogram: {
    r: number[]
    g: number[]
    b: number[]
  }
  labHistogram: {
    L: number[]
    a: number[]
    b: number[]
  }
  greenness: number
  yellowness: number
  brownness: number
  colorEntropy: number
  colorContrast: number
}

/**
 * Extract histogram-based features from image
 */
export function extractHistogramFeatures(imageData: ImageData, bins: number = 32): HistogramFeatures {
  const { data, width, height } = imageData
  const totalPixels = width * height
  
  // Initialize histograms
  const histR = new Array(bins).fill(0)
  const histG = new Array(bins).fill(0)
  const histB = new Array(bins).fill(0)
  const histL = new Array(bins).fill(0)
  const histA = new Array(bins).fill(0)
  const histBb = new Array(bins).fill(0)
  
  let greenness = 0
  let yellowness = 0
  let brownness = 0

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // RGB histogram
    histR[Math.floor((r / 256) * bins)]++
    histG[Math.floor((g / 256) * bins)]++
    histB[Math.floor((b / 256) * bins)]++
    
    // LAB histogram
    const lab = rgbToLab(r, g, b)
    histL[Math.floor((lab.L / 100) * (bins - 1))]++
    histA[Math.floor(((lab.a + 128) / 256) * bins)]++
    histBb[Math.floor(((lab.b + 128) / 256) * bins)]++
    
    // Color features
    const rn = r / 255
    const gn = g / 255
    const bn = b / 255
    
    // Greenness: excess green index
    greenness += (2 * gn - rn - bn) / 2
    
    // Yellowness: red + green without blue
    yellowness += (rn + gn - 2 * bn) / 2
    
    // Brownness: characteristic brown color
    if (r > 80 && g > 50 && b < 100 && r > g && g > b) {
      brownness++
    }
  }
  
  // Normalize histograms
  const normalizeHist = (hist: number[]) => hist.map(v => v / totalPixels)
  
  // Calculate color entropy
  const normalizedR = normalizeHist(histR)
  let colorEntropy = 0
  for (const p of normalizedR) {
    if (p > 0) colorEntropy -= p * Math.log2(p)
  }
  
  // Calculate color contrast (difference between max and min in each channel)
  const findRange = (hist: number[]) => {
    let minIdx = 0, maxIdx = bins - 1
    for (let i = 0; i < bins; i++) {
      if (hist[i] > 0) { minIdx = i; break; }
    }
    for (let i = bins - 1; i >= 0; i--) {
      if (hist[i] > 0) { maxIdx = i; break; }
    }
    return (maxIdx - minIdx) / bins
  }
  
  const colorContrast = (findRange(histR) + findRange(histG) + findRange(histB)) / 3

  return {
    colorHistogram: {
      r: normalizeHist(histR),
      g: normalizeHist(histG),
      b: normalizeHist(histB)
    },
    labHistogram: {
      L: normalizeHist(histL),
      a: normalizeHist(histA),
      b: normalizeHist(histBb)
    },
    greenness: greenness / totalPixels,
    yellowness: yellowness / totalPixels,
    brownness: (brownness / totalPixels) * 100,
    colorEntropy,
    colorContrast
  }
}

// ============================================
// SPECIES CLASSIFICATION
// ============================================

export interface GrassSpeciesProfile {
  id: string
  name: string
  labSignature: { L: [number, number], a: [number, number], b: [number, number] }
  textureProfile: { homogeneity: [number, number], energy: [number, number] }
  seasonalVariation: "low" | "medium" | "high"
  nutritionalValue: "low" | "medium" | "high" | "very_high"
  droughtTolerance: "low" | "medium" | "high"
}

export const GRASS_SPECIES_DATABASE: GrassSpeciesProfile[] = [
  {
    id: "perennial_ryegrass",
    name: "Perennial Ryegrass",
    labSignature: { L: [35, 55], a: [-25, -10], b: [15, 35] },
    textureProfile: { homogeneity: [0.4, 0.7], energy: [0.1, 0.3] },
    seasonalVariation: "medium",
    nutritionalValue: "very_high",
    droughtTolerance: "low"
  },
  {
    id: "tall_fescue",
    name: "Tall Fescue",
    labSignature: { L: [30, 50], a: [-20, -5], b: [20, 40] },
    textureProfile: { homogeneity: [0.3, 0.6], energy: [0.15, 0.35] },
    seasonalVariation: "low",
    nutritionalValue: "high",
    droughtTolerance: "high"
  },
  {
    id: "white_clover",
    name: "White Clover",
    labSignature: { L: [40, 60], a: [-30, -15], b: [10, 25] },
    textureProfile: { homogeneity: [0.5, 0.8], energy: [0.05, 0.2] },
    seasonalVariation: "medium",
    nutritionalValue: "very_high",
    droughtTolerance: "medium"
  },
  {
    id: "kikuyu",
    name: "Kikuyu Grass",
    labSignature: { L: [35, 50], a: [-20, -8], b: [25, 45] },
    textureProfile: { homogeneity: [0.35, 0.55], energy: [0.2, 0.4] },
    seasonalVariation: "low",
    nutritionalValue: "medium",
    droughtTolerance: "high"
  },
  {
    id: "lucerne",
    name: "Lucerne/Alfalfa",
    labSignature: { L: [30, 45], a: [-25, -12], b: [15, 30] },
    textureProfile: { homogeneity: [0.45, 0.7], energy: [0.1, 0.25] },
    seasonalVariation: "high",
    nutritionalValue: "very_high",
    droughtTolerance: "high"
  },
  {
    id: "cocksfoot",
    name: "Cocksfoot/Orchard Grass",
    labSignature: { L: [32, 48], a: [-18, -5], b: [22, 38] },
    textureProfile: { homogeneity: [0.3, 0.5], energy: [0.18, 0.38] },
    seasonalVariation: "medium",
    nutritionalValue: "high",
    droughtTolerance: "medium"
  }
]

export interface SpeciesClassificationResult {
  detectedSpecies: Array<{
    species: GrassSpeciesProfile
    confidence: number
    coveragePercent: number
  }>
  dominantSpecies: GrassSpeciesProfile | null
  speciesDiversity: number // 0-1 Shannon diversity index
  mixedPastureScore: number // 0-100
}

/**
 * Classify grass species from image features
 */
export function classifyGrassSpecies(
  segmentation: AdvancedSegmentationResult,
  histogramFeatures: HistogramFeatures,
  gaborFeatures: GaborFeatures
): SpeciesClassificationResult {
  const detectedSpecies: SpeciesClassificationResult["detectedSpecies"] = []
  
  const { dominantVegetationColor } = segmentation.statistics
  const { textureHomogeneity } = gaborFeatures
  const avgEnergy = gaborFeatures.energy.reduce((a, b) => a + b, 0) / gaborFeatures.energy.length
  
  for (const species of GRASS_SPECIES_DATABASE) {
    let score = 0
    let maxScore = 0
    
    // Check LAB signature match
    maxScore += 60
    const labMatch = 
      dominantVegetationColor.L >= species.labSignature.L[0] && 
      dominantVegetationColor.L <= species.labSignature.L[1] &&
      dominantVegetationColor.a >= species.labSignature.a[0] && 
      dominantVegetationColor.a <= species.labSignature.a[1] &&
      dominantVegetationColor.b >= species.labSignature.b[0] && 
      dominantVegetationColor.b <= species.labSignature.b[1]
    
    if (labMatch) {
      score += 40
      // Bonus for being close to center of range
      const lCenter = (species.labSignature.L[0] + species.labSignature.L[1]) / 2
      const aCenter = (species.labSignature.a[0] + species.labSignature.a[1]) / 2
      const bCenter = (species.labSignature.b[0] + species.labSignature.b[1]) / 2
      const dist = Math.sqrt(
        (dominantVegetationColor.L - lCenter) ** 2 +
        (dominantVegetationColor.a - aCenter) ** 2 +
        (dominantVegetationColor.b - bCenter) ** 2
      )
      score += Math.max(0, 20 - dist)
    }
    
    // Check texture profile match
    maxScore += 40
    const homogeneityMatch = 
      textureHomogeneity >= species.textureProfile.homogeneity[0] &&
      textureHomogeneity <= species.textureProfile.homogeneity[1]
    const energyMatch =
      avgEnergy >= species.textureProfile.energy[0] &&
      avgEnergy <= species.textureProfile.energy[1]
    
    if (homogeneityMatch) score += 20
    if (energyMatch) score += 20
    
    const confidence = score / maxScore
    
    if (confidence > 0.3) {
      // Estimate coverage based on color distribution
      const coveragePercent = Math.min(
        segmentation.statistics.vegetationPercent,
        confidence * segmentation.statistics.vegetationPercent
      )
      
      detectedSpecies.push({
        species,
        confidence,
        coveragePercent
      })
    }
  }
  
  // Sort by confidence
  detectedSpecies.sort((a, b) => b.confidence - a.confidence)
  
  // Calculate diversity index
  let diversitySum = 0
  const totalCoverage = detectedSpecies.reduce((sum, s) => sum + s.coveragePercent, 0)
  for (const s of detectedSpecies) {
    const p = s.coveragePercent / totalCoverage
    if (p > 0) diversitySum -= p * Math.log(p)
  }
  const maxDiversity = Math.log(GRASS_SPECIES_DATABASE.length)
  const speciesDiversity = maxDiversity > 0 ? diversitySum / maxDiversity : 0
  
  // Mixed pasture score
  const mixedPastureScore = Math.min(100, detectedSpecies.length * 25 + speciesDiversity * 50)

  return {
    detectedSpecies: detectedSpecies.slice(0, 4), // Top 4 species
    dominantSpecies: detectedSpecies.length > 0 ? detectedSpecies[0].species : null,
    speciesDiversity,
    mixedPastureScore
  }
}

// ============================================
// ENHANCED BIOMASS ESTIMATION
// ============================================

export interface EnhancedBiomassResult {
  total: number // kg/ha
  green: number
  dead: number
  clover: number
  confidence: number
  method: string
  details: {
    ndviContribution: number
    textureContribution: number
    speciesContribution: number
    coverageContribution: number
  }
}

/**
 * Enhanced biomass estimation using multiple features
 */
export function enhancedBiomassEstimation(
  segmentation: AdvancedSegmentationResult,
  histogramFeatures: HistogramFeatures,
  gaborFeatures: GaborFeatures,
  speciesClassification: SpeciesClassificationResult
): EnhancedBiomassResult {
  const { vegetationPercent, deadPercent } = segmentation.statistics
  
  // Base estimation from vegetation coverage
  const coverageContribution = vegetationPercent * 30 // kg/ha per % coverage
  
  // Adjust based on greenness (healthier = more biomass)
  const greennessMultiplier = 1 + histogramFeatures.greenness * 0.5
  
  // Texture contribution (more uniform texture often indicates denser growth)
  const textureContribution = gaborFeatures.textureHomogeneity * 500
  
  // Species-based adjustment
  let speciesMultiplier = 1.0
  if (speciesClassification.dominantSpecies) {
    switch (speciesClassification.dominantSpecies.nutritionalValue) {
      case "very_high":
        speciesMultiplier = 1.3
        break
      case "high":
        speciesMultiplier = 1.15
        break
      case "medium":
        speciesMultiplier = 1.0
        break
      case "low":
        speciesMultiplier = 0.85
        break
    }
  }
  
  // Calculate components
  const greenBiomass = (coverageContribution + textureContribution) * greennessMultiplier * speciesMultiplier
  const deadBiomass = deadPercent * 15 // Dead material density
  const cloverBiomass = speciesClassification.detectedSpecies
    .filter(s => s.species.id === "white_clover" || s.species.id === "lucerne")
    .reduce((sum, s) => sum + s.coveragePercent * 20, 0)
  
  const totalBiomass = greenBiomass + deadBiomass
  
  // Confidence based on analysis quality
  const confidence = Math.min(1, 
    (vegetationPercent > 20 ? 0.3 : 0.1) +
    (speciesClassification.detectedSpecies.length > 0 ? 0.3 : 0) +
    (gaborFeatures.textureHomogeneity > 0.4 ? 0.2 : 0.1) +
    (histogramFeatures.greenness > 0 ? 0.2 : 0.1)
  )

  return {
    total: Math.round(totalBiomass),
    green: Math.round(greenBiomass),
    dead: Math.round(deadBiomass),
    clover: Math.round(cloverBiomass),
    confidence,
    method: "multi-feature-fusion",
    details: {
      ndviContribution: Math.round(histogramFeatures.greenness * 1000),
      textureContribution: Math.round(textureContribution),
      speciesContribution: Math.round((speciesMultiplier - 1) * 100),
      coverageContribution: Math.round(coverageContribution)
    }
  }
}

// ============================================
// FEATURE VECTOR FOR ML MODELS
// ============================================

export interface MLFeatureVector {
  features: number[]
  featureNames: string[]
  normalized: number[]
}

/**
 * Extract feature vector suitable for machine learning models
 */
export function extractMLFeatureVector(
  segmentation: AdvancedSegmentationResult,
  histogramFeatures: HistogramFeatures,
  gaborFeatures: GaborFeatures
): MLFeatureVector {
  const features: number[] = []
  const featureNames: string[] = []
  
  // Segmentation features
  features.push(segmentation.statistics.vegetationPercent)
  featureNames.push("vegetation_percent")
  
  features.push(segmentation.statistics.soilPercent)
  featureNames.push("soil_percent")
  
  features.push(segmentation.statistics.deadPercent)
  featureNames.push("dead_percent")
  
  features.push(segmentation.statistics.dominantVegetationColor.L)
  featureNames.push("veg_L")
  
  features.push(segmentation.statistics.dominantVegetationColor.a)
  featureNames.push("veg_a")
  
  features.push(segmentation.statistics.dominantVegetationColor.b)
  featureNames.push("veg_b")
  
  // Histogram features
  features.push(histogramFeatures.greenness)
  featureNames.push("greenness")
  
  features.push(histogramFeatures.yellowness)
  featureNames.push("yellowness")
  
  features.push(histogramFeatures.brownness)
  featureNames.push("brownness")
  
  features.push(histogramFeatures.colorEntropy)
  featureNames.push("color_entropy")
  
  features.push(histogramFeatures.colorContrast)
  featureNames.push("color_contrast")
  
  // Gabor texture features
  features.push(gaborFeatures.textureHomogeneity)
  featureNames.push("texture_homogeneity")
  
  features.push(gaborFeatures.dominantOrientation)
  featureNames.push("dominant_orientation")
  
  // Add energy features
  for (let i = 0; i < Math.min(4, gaborFeatures.energy.length); i++) {
    features.push(gaborFeatures.energy[i])
    featureNames.push(`gabor_energy_${i}`)
  }
  
  // Normalize features to 0-1 range
  const mins = features.map(() => 0)
  const maxs = [100, 100, 100, 100, 127, 127, 1, 1, 100, 10, 1, 1, 180, 1, 1, 1, 1]
  
  const normalized = features.map((f, i) => {
    const min = mins[i] || 0
    const max = maxs[i] || 1
    return Math.max(0, Math.min(1, (f - min) / (max - min)))
  })

  return {
    features,
    featureNames,
    normalized
  }
}

// ============================================
// COMPLETE ANALYSIS PIPELINE
// ============================================

export interface CompleteAnalysisResult {
  segmentation: AdvancedSegmentationResult
  histogram: HistogramFeatures
  texture: GaborFeatures
  species: SpeciesClassificationResult
  biomass: EnhancedBiomassResult
  mlFeatures: MLFeatureVector
  processingTimeMs: number
}

/**
 * Run complete open-source AI analysis pipeline
 */
export function runCompleteAnalysis(imageData: ImageData): CompleteAnalysisResult {
  const startTime = performance.now()
  
  // Step 1: Advanced segmentation
  const segmentation = advancedSegmentation(imageData, 5)
  
  // Step 2: Histogram features
  const histogram = extractHistogramFeatures(imageData)
  
  // Step 3: Gabor texture analysis
  const texture = gaborTextureAnalysis(imageData)
  
  // Step 4: Species classification
  const species = classifyGrassSpecies(segmentation, histogram, texture)
  
  // Step 5: Enhanced biomass estimation
  const biomass = enhancedBiomassEstimation(segmentation, histogram, texture, species)
  
  // Step 6: ML feature extraction
  const mlFeatures = extractMLFeatureVector(segmentation, histogram, texture)
  
  const processingTimeMs = performance.now() - startTime

  return {
    segmentation,
    histogram,
    texture,
    species,
    biomass,
    mlFeatures,
    processingTimeMs
  }
}
