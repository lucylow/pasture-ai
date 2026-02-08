"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Leaf,
  Upload,
  History,
  Info,
  Settings,
  Home,
  Menu,
  X,
  ArrowLeft,
  Layers,
  BarChart3,
  Map,
  TrendingUp,
  Droplets,
  Sun,
  Wind,
  Cpu,
  Cloud,
  Zap,
  Lightbulb,
  Sprout,
  TreeDeciduous,
  Bug,
  Footprints,
  Beef,
  Heart,
  Calculator,
  Calendar,
  DollarSign,
  Thermometer,
  Scale,
  Wheat,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react"
import {
  calculateVegetationIndices,
  calculateTextureMetrics,
  segmentImage,
  estimateBiomass,
  classifyPastureHealth,
  generateRecommendations,
  calculateSustainability,
  LIVESTOCK_DATABASE,
  calculateStockingRate,
  estimateNutritionalValue,
  assessAnimalWelfare,
  generateRotationalPlan,
  calculateFeedBudget,
  type VegetationAnalysis,
  type TextureMetrics as ClientTextureMetrics,
  type LivestockType,
  type StockingRateResult,
  type NutritionalAnalysis,
  type AnimalWelfareIndicators,
  type RotationalGrazingPlan,
  type FeedBudget,
} from "@/lib/client-ai"
import {
  runCompleteAnalysis,
  type CompleteAnalysisResult,
} from "@/lib/open-source-ai"

type Screen = "upload" | "history" | "result" | "info" | "settings" | "livestock"
type AnalysisMode = "client" | "api" | "hybrid"
type LivestockTab = "stocking" | "nutrition" | "welfare" | "rotation" | "budget"

interface VegetationIndices {
  ndvi: number
  gndvi: number
  evi: number
  savi: number
  msavi: number
}

interface TextureAnalysis {
  glcm_contrast: number
  glcm_homogeneity: number
  entropy: number
  canopy_fragmentation: number
}

interface SpatialAnalysis {
  dead_zone_pct: number
  healthy_patch_count: number
  bare_soil_pct: number
  edge_density: number
}

interface TemporalIndicators {
  growth_trend: "declining" | "stable" | "improving"
  recovery_potential: "low" | "moderate" | "high"
  seasonal_stage: "dormant" | "early_growth" | "peak_growth" | "senescence"
}

interface HistoryEntry {
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
    client_analysis?: {
      indices: VegetationAnalysis
      texture: ClientTextureMetrics
      biomass: ReturnType<typeof estimateBiomass>
      health: ReturnType<typeof classifyPastureHealth>
      recommendations: ReturnType<typeof generateRecommendations>
      sustainability: ReturnType<typeof calculateSustainability>
    }
  }
}

// Ecological tips data
const ecologicalTips = [
  {
    id: 1,
    icon: Footprints,
    title: "Rotational Grazing",
    description: "Move livestock between paddocks to allow pasture recovery",
    benefit: "Increases forage yield by 20-30% and improves soil health",
    difficulty: "easy" as const,
  },
  {
    id: 2,
    icon: Sprout,
    title: "Multi-Species Pastures",
    description: "Plant diverse grass and legume mixes for resilience",
    benefit: "Improves nitrogen fixation and provides year-round forage",
    difficulty: "moderate" as const,
  },
  {
    id: 3,
    icon: TreeDeciduous,
    title: "Silvopasture Integration",
    description: "Integrate trees with pastures for shade and carbon storage",
    benefit: "Sequesters 2-5x more carbon than open pastures",
    difficulty: "advanced" as const,
  },
  {
    id: 4,
    icon: Bug,
    title: "Dung Beetle Introduction",
    description: "Encourage beneficial insects for nutrient cycling",
    benefit: "Improves soil aeration and reduces fly populations by 90%",
    difficulty: "moderate" as const,
  },
  {
    id: 5,
    icon: Droplets,
    title: "Water Point Management",
    description: "Strategically place water sources to distribute grazing",
    benefit: "Prevents overgrazing near water and improves coverage",
    difficulty: "easy" as const,
  },
  {
    id: 6,
    icon: Leaf,
    title: "Leave Residual Biomass",
    description: "Never graze below 3-4 inches to maintain root health",
    benefit: "Faster regrowth and better drought resistance",
    difficulty: "easy" as const,
  },
]

export function PastureAIDemoUI() {
  const [screen, setScreen] = useState<Screen>("upload")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<HistoryEntry | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeLayer, setActiveLayer] = useState<"original" | "ndvi" | "health" | "texture">("original")
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("hybrid")
  const [clientAnalysisResult, setClientAnalysisResult] = useState<{
    indices: VegetationAnalysis
    texture: ClientTextureMetrics
    biomass: ReturnType<typeof estimateBiomass>
    health: ReturnType<typeof classifyPastureHealth>
    recommendations: ReturnType<typeof generateRecommendations>
    sustainability: ReturnType<typeof calculateSustainability>
  } | null>(null)
  const [advancedAnalysis, setAdvancedAnalysis] = useState<CompleteAnalysisResult | null>(null)
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false)

  // Livestock management state
  const [selectedLivestock, setSelectedLivestock] = useState<LivestockType>(LIVESTOCK_DATABASE[1]) // Default: Beef Cattle
  const [headCount, setHeadCount] = useState(50)
  const [paddockSize, setPaddockSize] = useState(10) // hectares
  const [totalPaddocks, setTotalPaddocks] = useState(6)
  const [ambientTemp, setAmbientTemp] = useState(25)
  const [livestockTab, setLivestockTab] = useState<LivestockTab>("stocking")
  const [livestockAnalysis, setLivestockAnalysis] = useState<{
    stocking: StockingRateResult | null
    nutrition: NutritionalAnalysis | null
    welfare: AnimalWelfareIndicators | null
    rotation: RotationalGrazingPlan | null
    budget: FeedBudget | null
  }>({
    stocking: null,
    nutrition: null,
    welfare: null,
    rotation: null,
    budget: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pasture_history_v2")
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to load history:", e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("pasture_history_v2", JSON.stringify(history))
  }, [history])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === "u") setScreen("upload")
      if (e.altKey && e.key.toLowerCase() === "l") setScreen("livestock")
      if (e.altKey && e.key.toLowerCase() === "h") setScreen("history")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    const el = dropRef.current
    if (!el) return

    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
      setDragOver(true)
    }
    const onDragLeave = () => {
      setDragOver(false)
    }
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const files = Array.from(e.dataTransfer?.files || [])
      if (files.length) handleFiles(files)
    }

    el.addEventListener("dragover", onDragOver)
    el.addEventListener("dragleave", onDragLeave)
    el.addEventListener("drop", onDrop)

    return () => {
      el.removeEventListener("dragover", onDragOver)
      el.removeEventListener("dragleave", onDragLeave)
      el.removeEventListener("drop", onDrop)
    }
  }, [])

  function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result as string)
      r.readAsDataURL(file)
    })
  }

  // Client-side analysis function (free, runs in browser)
  async function runClientAnalysis(dataUrl: string): Promise<{
    indices: VegetationAnalysis
    texture: ClientTextureMetrics
    biomass: ReturnType<typeof estimateBiomass>
    health: ReturnType<typeof classifyPastureHealth>
    recommendations: ReturnType<typeof generateRecommendations>
    sustainability: ReturnType<typeof calculateSustainability>
    advanced: CompleteAnalysisResult | null
  }> {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        // Resize for faster processing while maintaining quality
        const maxSize = 800
        let width = img.width
        let height = img.height
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Could not get canvas context")

        ctx.drawImage(img, 0, 0, width, height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Run basic client-side analysis
        const indices = calculateVegetationIndices(imageData)
        const texture = calculateTextureMetrics(imageData)
        const biomass = estimateBiomass(indices)
        const health = classifyPastureHealth(biomass.total, indices.ndvi)
        const recommendations = generateRecommendations(biomass, health, indices)
        const sustainability = calculateSustainability(biomass.total, indices)

        // Run advanced open-source AI analysis
        let advanced: CompleteAnalysisResult | null = null
        try {
          advanced = runCompleteAnalysis(imageData)
        } catch (err) {
          console.error("Advanced analysis failed:", err)
        }

        resolve({ indices, texture, biomass, health, recommendations, sustainability, advanced })
      }
      img.src = dataUrl
    })
  }

  const handleFiles = useCallback(
    async (files: File[]) => {
      const file = files[0]
      if (!file) return
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      const dataUrl = await fileToDataURL(file)
      setLoading(true)
      setProgress(5)

      try {
        let resultData: HistoryEntry["result"] = {}

        // Step 1: Always run client-side analysis first (free, instant)
        setTimeout(() => setProgress(15), 100)
        const clientResult = await runClientAnalysis(dataUrl)
        setClientAnalysisResult(clientResult)
        setAdvancedAnalysis(clientResult.advanced)
        setTimeout(() => setProgress(35), 50)

        if (analysisMode === "client") {
          // Client-only mode - use local analysis
          resultData = {
            predictions: {
              dry_green_g: clientResult.biomass.dryGreen,
              dry_dead_g: clientResult.biomass.dryDead,
              dry_clover_g: clientResult.biomass.dryClover,
              gdm_g: clientResult.biomass.gdm,
              dry_total_g: clientResult.biomass.total,
            },
            metrics: {
              pasture_health: clientResult.health,
              coverage_pct: clientResult.indices.greenCoverage,
              biomass_density: clientResult.biomass.total,
              greenness_index: clientResult.indices.healthScore,
            },
            vegetation_indices: {
              ndvi: clientResult.indices.ndvi,
              gndvi: clientResult.indices.gndvi,
              evi: clientResult.indices.evi,
              savi: clientResult.indices.savi,
              msavi: clientResult.indices.msavi,
            },
            texture_analysis: {
              glcm_contrast: clientResult.texture.contrast,
              glcm_homogeneity: clientResult.texture.homogeneity,
              entropy: clientResult.texture.entropy,
              canopy_fragmentation: 1 - clientResult.texture.homogeneity,
            },
            recommendations: {
              grazing_action: clientResult.recommendations.action,
              grazing_days: clientResult.recommendations.grazingDays,
              rest_days: clientResult.recommendations.restDays,
              priority_areas: clientResult.recommendations.priorityAreas,
            },
            confidence_score: 0.85,
            processing_time_ms: 50,
            analysis_mode: "client-side (free)",
          }
          setProgress(95)
        } else {
          // API or Hybrid mode - call real /api/analyze endpoint
          const form = new FormData()
          form.append("image", file, file.name)
          form.append("mode", analysisMode === "hybrid" ? "hybrid" : "oss")

          setTimeout(() => setProgress(50), 150)

          const response = await fetch("/api/analyze", {
            method: "POST",
            body: form,
          })

          setProgress(75)

          if (!response.ok) {
            const txt = await response.text()
            throw new Error(`Server error: ${txt}`)
          }

          const json = await response.json()
          const apiData = json.data || json
          resultData = {
            predictions: apiData.predictions,
            metrics: apiData.metrics,
            vegetation_indices: apiData.oss_analysis?.indices?.mean || {
              ndvi: clientResult.indices.ndvi,
              gndvi: clientResult.indices.gndvi,
              evi: clientResult.indices.evi,
              savi: clientResult.indices.savi,
              msavi: clientResult.indices.msavi,
            },
            texture_analysis: {
              glcm_contrast: clientResult.texture.contrast,
              glcm_homogeneity: clientResult.texture.homogeneity,
              entropy: clientResult.texture.entropy,
              canopy_fragmentation: 1 - clientResult.texture.homogeneity,
            },
            recommendations: {
              grazing_action: apiData.recommendations?.grazing_recommendation || clientResult.recommendations.action,
              grazing_days: apiData.recommendations?.grazing_duration_days || clientResult.recommendations.grazingDays,
              rest_days: apiData.recommendations?.rest_period_days || clientResult.recommendations.restDays,
              priority_areas: clientResult.recommendations.priorityAreas,
            },
            confidence_score: apiData.confidence_score || 0.85,
            processing_time_ms: apiData.processing_time_ms || 0,
            analysis_mode: apiData.analysis_mode === "hybrid" ? "hybrid (OSS + AI vision)" : "server-side OSS",
            oss_analysis: apiData.oss_analysis,
            ai_refinement: apiData.ai_refinement,
            engine: apiData.engine,
            client_analysis: clientResult,
          }
          setProgress(95)
        }

        const entry: HistoryEntry = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          date: new Date().toISOString(),
          preview: dataUrl,
          result: resultData,
        }

        setResult(entry)
        setHistory((h) => [entry, ...h].slice(0, 50))
        setScreen("result")
        setProgress(100)
      } catch (err) {
        console.error(err)
        alert("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"))
      } finally {
        setTimeout(() => setLoading(false), 350)
        setTimeout(() => setProgress(0), 500)
      }
    },
    [analysisMode]
  )

  // Calculate livestock metrics when analysis is available
  const calculateLivestockMetrics = useCallback(() => {
    if (!clientAnalysisResult) return

    const { biomass, health, indices } = clientAnalysisResult

    const stocking = calculateStockingRate(biomass, health, selectedLivestock, paddockSize, headCount)
    const nutrition = estimateNutritionalValue(indices, health)
    const welfare = assessAnimalWelfare(indices, health, selectedLivestock, ambientTemp)
    const rotation = generateRotationalPlan(health, selectedLivestock, totalPaddocks)
    const budget = calculateFeedBudget(biomass, health, selectedLivestock, headCount, paddockSize)

    setLivestockAnalysis({ stocking, nutrition, welfare, rotation, budget })
  }, [clientAnalysisResult, selectedLivestock, headCount, paddockSize, totalPaddocks, ambientTemp])

  // Recalculate livestock metrics when parameters change
  useEffect(() => {
    calculateLivestockMetrics()
  }, [calculateLivestockMetrics])

  async function simulateDemo() {
    const canvas = document.createElement("canvas")
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#7ee787"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.fillStyle = `rgba(34, 197, 94, ${0.2 + Math.random() * 0.4})`
      const r = 30 + Math.random() * 120
      ctx.ellipse(50 + Math.random() * 540, 40 + Math.random() * 400, r, r * 0.6, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], `demo_${Date.now()}.jpg`, { type: "image/jpeg" })
    handleFiles([file])
  }

  function VegetationIndexGauge({
    label,
    value,
    min = -1,
    max = 1,
    description,
  }: {
    label: string
    value: number
    min?: number
    max?: number
    description: string
  }) {
    const normalized = ((value - min) / (max - min)) * 100
    const getColor = () => {
      if (value < 0) return "bg-red-500"
      if (value < 0.2) return "bg-orange-500"
      if (value < 0.4) return "bg-yellow-500"
      if (value < 0.6) return "bg-lime-500"
      return "bg-emerald-500"
    }

    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-lg font-bold text-slate-900">{value.toFixed(3)}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
          <motion.div
            className={`h-full ${getColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, normalized)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    )
  }

  function NDVIHeatmap({ ndvi, imageUrl }: { ndvi: number; imageUrl: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Simulate NDVI from RGB (pseudo-NDVI)
          const pseudoNIR = g * 0.5 + r * 0.3 + b * 0.2
          const pseudoNDVI = (pseudoNIR - r) / (pseudoNIR + r + 1)

          // Apply NDVI colormap
          const adjusted = (pseudoNDVI + 1) / 2 // Normalize to 0-1
          if (adjusted < 0.3) {
            // Low vegetation - red/brown
            data[i] = 180
            data[i + 1] = 60
            data[i + 2] = 30
          } else if (adjusted < 0.5) {
            // Medium - yellow/orange
            data[i] = 220
            data[i + 1] = 180
            data[i + 2] = 50
          } else if (adjusted < 0.7) {
            // Good - light green
            data[i] = 120
            data[i + 1] = 200
            data[i + 2] = 80
          } else {
            // Excellent - dark green
            data[i] = 34
            data[i + 1] = 139
            data[i + 2] = 34
          }
          data[i + 3] = 200 // Semi-transparent
        }

        ctx.putImageData(imageData, 0, 0)
      }
      img.src = imageUrl
    }, [ndvi, imageUrl])

    return (
      <div className="relative">
        <canvas ref={canvasRef} className="w-full rounded-lg" />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">NDVI Heatmap</div>
      </div>
    )
  }

  function HealthOverlay({
    health,
    coverage,
    imageUrl,
  }: {
    health: string
    coverage: number
    imageUrl: string
  }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Apply health-based color overlay
        const healthColors: Record<string, string> = {
          poor: "rgba(239, 68, 68, 0.4)",
          fair: "rgba(251, 191, 36, 0.4)",
          good: "rgba(132, 204, 22, 0.4)",
          excellent: "rgba(34, 197, 94, 0.4)",
        }

        ctx.fillStyle = healthColors[health] || healthColors.fair
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw coverage indicator
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.fillRect(10, canvas.height - 40, 150, 30)
        ctx.fillStyle = "#1e293b"
        ctx.font = "14px system-ui"
        ctx.fillText(`Coverage: ${coverage}%`, 20, canvas.height - 20)
      }
      img.src = imageUrl
    }, [health, coverage, imageUrl])

    return (
      <div className="relative">
        <canvas ref={canvasRef} className="w-full rounded-lg" />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Health Overlay</div>
      </div>
    )
  }

  function TextureVisualization({
    texture,
    imageUrl,
  }: {
    texture: TextureAnalysis
    imageUrl: string
  }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Convert to grayscale for texture emphasis
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
          // Enhance contrast based on texture metrics
          const enhanced = Math.min(255, gray * (1 + texture.glcm_contrast * 0.5))
          data[i] = enhanced
          data[i + 1] = enhanced
          data[i + 2] = enhanced
        }

        ctx.putImageData(imageData, 0, 0)

        // Overlay texture grid
        ctx.strokeStyle = "rgba(34, 197, 94, 0.3)"
        ctx.lineWidth = 1
        const gridSize = 32
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }
      img.src = imageUrl
    }, [texture, imageUrl])

    return (
      <div className="relative">
        <canvas ref={canvasRef} className="w-full rounded-lg" />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Texture Analysis
        </div>
      </div>
    )
  }

  const navItems = [
    { id: "upload" as Screen, label: "Upload & Predict", icon: Upload, shortcut: "Alt+U" },
    { id: "livestock" as Screen, label: "Livestock Manager", icon: Beef, shortcut: "Alt+L" },
    { id: "history" as Screen, label: "History", icon: History, shortcut: "Alt+H" },
    { id: "info" as Screen, label: "Model Info", icon: Info },
    { id: "settings" as Screen, label: "Settings", icon: Settings },
  ]

  function LeftNav() {
    return (
      <nav className="w-64 border-r border-slate-200 p-4 hidden md:block bg-white" aria-label="Primary">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900">
              Pasture<span className="text-emerald-500">AI</span>
            </span>
          </Link>
          <p className="text-sm text-slate-500">Advanced biomass analysis</p>
        </div>

        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setScreen(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                  screen === item.id ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50 text-slate-700"
                }`}
                aria-current={screen === item.id ? "page" : undefined}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {item.shortcut && <span className="text-xs text-slate-400">{item.shortcut}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Landing Page
          </Link>
        </div>

        <div className="mt-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-xs text-emerald-700 font-medium mb-1">Advanced Analysis</p>
          <p className="text-xs text-emerald-600">Includes NDVI, GNDVI, EVI, texture analysis, and spatial metrics.</p>
        </div>
      </nav>
    )
  }

  function MobileHeader() {
    return (
      <header className="md:hidden p-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg">PastureAI</span>
        </Link>
        <button
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>
    )
  }

  function MobileMenu() {
    if (!mobileMenuOpen) return null

    return (
      <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
        <nav className="absolute top-0 right-0 w-64 h-full bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="pt-16 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setScreen(item.id)
                  setMobileMenuOpen(false)
                }}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 ${
                  screen === item.id ? "bg-emerald-50 text-emerald-700" : "hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <Link
              href="/"
              className="w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 hover:bg-slate-50 mt-4 border-t pt-4"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </nav>
      </div>
    )
  }

  function DesktopHeader() {
    return (
      <header className="hidden md:flex p-4 border-b border-slate-200 items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-slate-900">
            {screen === "upload" && "Upload & Predict"}
            {screen === "livestock" && "Livestock Manager"}
            {screen === "history" && "Analysis History"}
            {screen === "result" && "Analysis Result"}
            {screen === "info" && "Model Information"}
            {screen === "settings" && "Settings"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
            onClick={() => {
              setScreen("upload")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            New Prediction
          </button>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
            v2.0 Advanced
          </span>
        </div>
      </header>
    )
  }

  function UploadScreen() {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Upload an image</h2>
          <p className="text-slate-500">
            Drag & drop a pasture photo for advanced AI analysis including vegetation indices, texture analysis, and
            spatial metrics.
          </p>
        </div>

        {/* Analysis Mode Selector */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            Analysis Mode
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setAnalysisMode("client")}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                analysisMode === "client"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-sm">Client-Side</span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Free</span>
              </div>
              <p className="text-xs text-slate-500">Runs locally in browser. No API calls. Works offline.</p>
            </button>

            <button
              onClick={() => setAnalysisMode("hybrid")}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                analysisMode === "hybrid"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-sm">Hybrid</span>
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Recommended</span>
              </div>
              <p className="text-xs text-slate-500">Client analysis + AI enhancement. Best accuracy.</p>
            </button>

            <button
              onClick={() => setAnalysisMode("api")}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                analysisMode === "api"
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">Cloud AI</span>
              </div>
              <p className="text-xs text-slate-500">Full AI vision analysis. Most detailed insights.</p>
            </button>
          </div>
        </div>

        <div
          ref={dropRef}
          className={`rounded-xl border-2 transition-colors p-8 ${
            dragOver ? "border-emerald-400 bg-emerald-50" : "border-dashed border-slate-300 bg-slate-50"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="text-center md:text-left">
              <Upload className="w-12 h-12 text-slate-400 mx-auto md:mx-0 mb-3" />
              <p className="text-slate-700 font-medium mb-1">Drop image here</p>
              <p className="text-sm text-slate-500">JPEG/PNG. Landscape photos work best.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Choose file...
              </button>
              <button
                onClick={simulateDemo}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition-colors"
              >
                Try Demo Image
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
            <Layers className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">NDVI Analysis</p>
            <p className="text-xs text-slate-500">Vegetation health</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
            <BarChart3 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Biomass Metrics</p>
            <p className="text-xs text-slate-500">g/m² estimates</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
            <Map className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Spatial Analysis</p>
            <p className="text-xs text-slate-500">Coverage mapping</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Recommendations</p>
            <p className="text-xs text-slate-500">Grazing guidance</p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {history.slice(0, 3).map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setResult(h)
                    setScreen("result")
                  }}
                  className="text-left p-4 border border-slate-200 rounded-xl hover:shadow-md bg-white transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={h.preview || "/placeholder.svg"}
                      alt={h.fileName}
                      className="w-20 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{h.fileName}</p>
                      <p className="text-xs text-slate-500">{new Date(h.date).toLocaleString()}</p>
                      <p className="text-sm text-emerald-600 mt-1 capitalize">
                        {h.result?.metrics?.pasture_health || "Analyzed"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-600">
            <strong>Keyboard shortcuts:</strong> <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Alt</kbd> +{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">U</kbd> Upload,{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">Alt</kbd> +{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded text-xs">H</kbd> History
          </p>
        </div>
      </div>
    )
  }

  function HistoryScreen() {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">History</h2>
          <p className="text-slate-500">Previously analyzed images are stored locally in your browser.</p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No history yet. Try uploading an image!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((h) => (
              <motion.button
                key={h.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setResult(h)
                  setScreen("result")
                }}
                className="text-left p-4 border border-slate-200 rounded-xl bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={h.preview || "/placeholder.svg"}
                    alt={h.fileName}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{h.fileName}</p>
                    <p className="text-xs text-slate-500">{new Date(h.date).toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-emerald-600 capitalize">
                        {h.result?.metrics?.pasture_health || "Analyzed"}
                      </span>
                      {h.result?.vegetation_indices?.ndvi && (
                        <span className="text-xs text-slate-500">
                          NDVI: {h.result.vegetation_indices.ndvi.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    )
  }

  function ResultScreen({ entry }: { entry: HistoryEntry | null }) {
    if (!entry) {
      return (
        <div className="p-6 text-center text-slate-500">
          <p>No result selected. Upload an image to get started.</p>
        </div>
      )
    }

    const preds = entry.result.predictions || {}
    const metrics = entry.result.metrics || {}
    const vegIndices = entry.result.vegetation_indices
    const texture = entry.result.texture_analysis
    const spatial = entry.result.spatial_analysis
    const temporal = entry.result.temporal_indicators
    const recommendations = entry.result.recommendations

    return (
      <div className="p-6">
        <button
          onClick={() => setScreen("history")}
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to history
        </button>

        {/* Layer Toggle */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "original", label: "Original", icon: Layers },
            { id: "ndvi", label: "NDVI Heatmap", icon: Sun },
            { id: "health", label: "Health Overlay", icon: Droplets },
            { id: "texture", label: "Texture", icon: Wind },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as typeof activeLayer)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeLayer === layer.id
                  ? "bg-emerald-500 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <layer.icon className="w-4 h-4" />
              {layer.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Visualization */}
          <div className="lg:col-span-1">
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              {activeLayer === "original" && (
                <img
                  src={entry.preview || "/placeholder.svg"}
                  alt={entry.fileName}
                  className="w-full rounded-lg mb-4"
                />
              )}
              {activeLayer === "ndvi" && vegIndices && <NDVIHeatmap ndvi={vegIndices.ndvi} imageUrl={entry.preview} />}
              {activeLayer === "health" && (
                <HealthOverlay
                  health={metrics.pasture_health || "fair"}
                  coverage={metrics.coverage_pct || 0}
                  imageUrl={entry.preview}
                />
              )}
              {activeLayer === "texture" && texture && (
                <TextureVisualization texture={texture} imageUrl={entry.preview} />
              )}

              <h3 className="font-semibold text-slate-900 mb-2 mt-4">{entry.fileName}</h3>
              <p className="text-xs text-slate-500 mb-4">{new Date(entry.date).toLocaleString()}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Pasture Health</span>
                  <span
                    className={`font-medium capitalize ${
                      metrics.pasture_health === "excellent"
                        ? "text-emerald-600"
                        : metrics.pasture_health === "good"
                          ? "text-lime-600"
                          : metrics.pasture_health === "fair"
                            ? "text-amber-600"
                            : "text-red-600"
                    }`}
                  >
                    {metrics.pasture_health || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Coverage</span>
                  <span className="font-medium">{metrics.coverage_pct?.toFixed(1) || "N/A"}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Biomass Density</span>
                  <span className="font-medium">{metrics.biomass_density?.toFixed(1) || "N/A"} g/m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Confidence</span>
                  <span className="font-medium">{((entry.result.confidence_score || 0) * 100).toFixed(0)}%</span>
                </div>
                {entry.result.processing_time_ms && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Processing Time</span>
                    <span className="font-medium">{entry.result.processing_time_ms}ms</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vegetation Indices */}
            {vegIndices && (
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-emerald-500" />
                  Vegetation Indices
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <VegetationIndexGauge
                    label="NDVI"
                    value={vegIndices.ndvi}
                    description="Normalized Difference Vegetation Index"
                  />
                  <VegetationIndexGauge
                    label="GNDVI"
                    value={vegIndices.gndvi}
                    description="Green NDVI (chlorophyll sensitive)"
                  />
                  <VegetationIndexGauge label="EVI" value={vegIndices.evi} description="Enhanced Vegetation Index" />
                  <VegetationIndexGauge
                    label="SAVI"
                    value={vegIndices.savi}
                    description="Soil-Adjusted Vegetation Index"
                  />
                </div>
              </div>
            )}

            {/* Texture & Spatial Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {texture && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Wind className="w-5 h-5 text-emerald-500" />
                    Texture Analysis
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "GLCM Contrast", value: texture.glcm_contrast },
                      { label: "Homogeneity", value: texture.glcm_homogeneity },
                      { label: "Entropy", value: texture.entropy },
                      { label: "Fragmentation", value: texture.canopy_fragmentation },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="font-medium">{(item.value * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${item.value * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {spatial && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Map className="w-5 h-5 text-emerald-500" />
                    Spatial Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Dead Zones</span>
                      <span className="font-medium text-red-600">{spatial.dead_zone_pct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Bare Soil</span>
                      <span className="font-medium text-amber-600">{spatial.bare_soil_pct.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Healthy Patches</span>
                      <span className="font-medium text-emerald-600">{spatial.healthy_patch_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Edge Density</span>
                      <span className="font-medium">{(spatial.edge_density * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Temporal Indicators */}
            {temporal && (
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Temporal Indicators
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Growth Trend</p>
                    <p
                      className={`font-semibold capitalize ${
                        temporal.growth_trend === "improving"
                          ? "text-emerald-600"
                          : temporal.growth_trend === "stable"
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {temporal.growth_trend}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Recovery Potential</p>
                    <p
                      className={`font-semibold capitalize ${
                        temporal.recovery_potential === "high"
                          ? "text-emerald-600"
                          : temporal.recovery_potential === "moderate"
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {temporal.recovery_potential}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Seasonal Stage</p>
                    <p className="font-semibold text-slate-700 capitalize">
                      {temporal.seasonal_stage.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations && (
              <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50">
                <h4 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Recommendations
                </h4>
                <p className="text-emerald-800 mb-4">{recommendations.grazing_action}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-emerald-700 mb-1">Grazing Period</p>
                    <p className="text-lg font-bold text-emerald-900">{recommendations.grazing_days} days</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-emerald-700 mb-1">Rest Period</p>
                    <p className="text-lg font-bold text-emerald-900">{recommendations.rest_days} days</p>
                  </div>
                </div>
                {recommendations.priority_areas && recommendations.priority_areas.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-emerald-700 mb-2">Priority Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.priority_areas.map((area, i) => (
                        <span key={i} className="px-2 py-1 bg-white/60 rounded text-xs text-emerald-800">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Biomass Predictions */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                Biomass Predictions (g/m²)
              </h4>
              <div className="space-y-3">
                {Object.entries(preds).map(([key, value]) => {
                  const max = 500
                  const pct = Math.min(100, (Number(value) / max) * 100)
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="font-medium">{Number(value).toFixed(1)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Ecological Tips for Improvement */}
            <div className="border border-teal-200 rounded-xl p-4 bg-gradient-to-br from-teal-50 to-emerald-50">
              <h4 className="font-semibold text-teal-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-teal-600" />
                Ecological Tips for Pasture Improvement
              </h4>
              <p className="text-sm text-teal-700 mb-4">
                Based on your analysis results, here are recommended practices for ecological transformation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ecologicalTips
                  .filter((tip) => {
                    // Show relevant tips based on pasture health
                    if (metrics.pasture_health === "poor") return tip.difficulty !== "advanced"
                    if (metrics.pasture_health === "fair") return true
                    return tip.difficulty !== "easy"
                  })
                  .slice(0, 4)
                  .map((tip) => (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: tip.id * 0.1 }}
                      className="bg-white rounded-lg p-3 border border-teal-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <tip.icon className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-slate-900 text-sm">{tip.title}</h5>
                            <span
                              className={`px-1.5 py-0.5 rounded text-xs ${
                                tip.difficulty === "easy"
                                  ? "bg-green-100 text-green-700"
                                  : tip.difficulty === "moderate"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {tip.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mb-1">{tip.description}</p>
                          <p className="text-xs text-teal-600 font-medium">{tip.benefit}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
              <Link
                href="/#tips"
                className="mt-4 flex items-center justify-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-medium"
              >
                <Leaf className="w-4 h-4" />
                View all ecological transformation tips
              </Link>
            </div>

            {/* Sustainability Metrics */}
            {clientAnalysisResult && (
              <div className="border border-green-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-lime-50">
                <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <TreeDeciduous className="w-5 h-5 text-green-600" />
                  Sustainability Impact
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">
                      {clientAnalysisResult.sustainability.carbonSequestration.toFixed(1)}
                    </p>
                    <p className="text-xs text-green-600">kg CO2/m²/year</p>
                    <p className="text-xs text-slate-500 mt-1">Carbon Sequestration</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">
                      {clientAnalysisResult.sustainability.waterRetention.toFixed(1)}
                    </p>
                    <p className="text-xs text-blue-600">mm capacity</p>
                    <p className="text-xs text-slate-500 mt-1">Water Retention</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-amber-700">
                      {(clientAnalysisResult.sustainability.soilHealthIndex * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-amber-600">index</p>
                    <p className="text-xs text-slate-500 mt-1">Soil Health</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg">
                    <p className="text-2xl font-bold text-purple-700">
                      {(clientAnalysisResult.sustainability.biodiversityScore * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-purple-600">score</p>
                    <p className="text-xs text-slate-500 mt-1">Biodiversity</p>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Open-Source AI Analysis */}
            {advancedAnalysis && (
              <div className="border border-indigo-200 rounded-xl p-4 bg-gradient-to-br from-indigo-50 to-slate-50">
                <button
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  className="w-full flex items-center justify-between"
                >
                  <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-600" />
                    Advanced AI Analysis (Open Source)
                  </h4>
                  <span className="text-xs text-indigo-600 font-medium">
                    {showAdvancedFeatures ? "Hide details" : "Show details"}
                  </span>
                </button>

                {/* Summary always visible */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <p className="text-xl font-bold text-indigo-700">
                      {advancedAnalysis.biomass.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-indigo-600">kg/ha</p>
                    <p className="text-xs text-slate-500 mt-1">Enhanced Biomass</p>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <p className="text-xl font-bold text-emerald-700">
                      {advancedAnalysis.segmentation.statistics.vegetationPercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-emerald-600">K-means segmented</p>
                    <p className="text-xs text-slate-500 mt-1">Vegetation Cover</p>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <p className="text-xl font-bold text-amber-700">
                      {advancedAnalysis.species.detectedSpecies.length}
                    </p>
                    <p className="text-xs text-amber-600">species detected</p>
                    <p className="text-xs text-slate-500 mt-1">Grass Species</p>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg">
                    <p className="text-xl font-bold text-slate-700">
                      {advancedAnalysis.processingTimeMs.toFixed(0)}ms
                    </p>
                    <p className="text-xs text-slate-500">browser-only</p>
                    <p className="text-xs text-slate-500 mt-1">Processing Time</p>
                  </div>
                </div>

                {showAdvancedFeatures && (
                  <div className="mt-4 space-y-4">
                    {/* K-means Segmentation Breakdown */}
                    <div className="bg-white/70 rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-3 text-sm">LAB Color Space Segmentation</h5>
                      <div className="space-y-2">
                        {[
                          { label: "Vegetation", value: advancedAnalysis.segmentation.statistics.vegetationPercent, color: "bg-emerald-500" },
                          { label: "Soil", value: advancedAnalysis.segmentation.statistics.soilPercent, color: "bg-amber-600" },
                          { label: "Dead Matter", value: advancedAnalysis.segmentation.statistics.deadPercent, color: "bg-yellow-500" },
                          { label: "Water", value: advancedAnalysis.segmentation.statistics.waterPercent, color: "bg-blue-500" },
                          { label: "Shadow", value: advancedAnalysis.segmentation.statistics.shadowPercent, color: "bg-slate-700" },
                        ].map((seg) => (
                          <div key={seg.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600">{seg.label}</span>
                              <span className="font-medium">{seg.value.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${seg.color} rounded-full transition-all`}
                                style={{ width: `${Math.min(100, seg.value)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detected Species */}
                    {advancedAnalysis.species.detectedSpecies.length > 0 && (
                      <div className="bg-white/70 rounded-lg p-4">
                        <h5 className="font-medium text-slate-900 mb-3 text-sm">Species Classification</h5>
                        <div className="space-y-2">
                          {advancedAnalysis.species.detectedSpecies.map((s) => (
                            <div key={s.species.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                              <div>
                                <span className="font-medium text-sm text-slate-900">{s.species.name}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    s.species.nutritionalValue === "very_high" ? "bg-emerald-100 text-emerald-700" :
                                    s.species.nutritionalValue === "high" ? "bg-lime-100 text-lime-700" :
                                    "bg-amber-100 text-amber-700"
                                  }`}>
                                    {s.species.nutritionalValue.replace("_", " ")} nutrition
                                  </span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    s.species.droughtTolerance === "high" ? "bg-blue-100 text-blue-700" :
                                    s.species.droughtTolerance === "medium" ? "bg-sky-100 text-sky-700" :
                                    "bg-red-100 text-red-700"
                                  }`}>
                                    {s.species.droughtTolerance} drought tolerance
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold text-slate-900">{(s.confidence * 100).toFixed(0)}%</span>
                                <p className="text-xs text-slate-500">{s.coveragePercent.toFixed(1)}% cover</p>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-200">
                            <div className="text-xs text-slate-500">
                              Diversity Index: <span className="font-medium text-slate-700">{(advancedAnalysis.species.speciesDiversity * 100).toFixed(0)}%</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Mixed Pasture Score: <span className="font-medium text-slate-700">{advancedAnalysis.species.mixedPastureScore.toFixed(0)}/100</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gabor Texture Features */}
                    <div className="bg-white/70 rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-3 text-sm">Gabor Filter Texture Analysis</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-center">
                          <p className="text-lg font-bold text-slate-900">
                            {(advancedAnalysis.texture.textureHomogeneity * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-slate-500">Homogeneity</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-center">
                          <p className="text-lg font-bold text-slate-900">
                            {advancedAnalysis.texture.dominantOrientation.toFixed(0)}deg
                          </p>
                          <p className="text-xs text-slate-500">Dominant Orientation</p>
                        </div>
                      </div>
                    </div>

                    {/* Histogram Color Features */}
                    <div className="bg-white/70 rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-3 text-sm">Color Histogram Features</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-center">
                          <p className="text-lg font-bold text-emerald-700">
                            {advancedAnalysis.histogram.greenness.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">Greenness</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-center">
                          <p className="text-lg font-bold text-yellow-700">
                            {advancedAnalysis.histogram.yellowness.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">Yellowness</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-center">
                          <p className="text-lg font-bold text-amber-800">
                            {advancedAnalysis.histogram.brownness.toFixed(1)}%
                          </p>
                          <p className="text-xs text-slate-500">Brownness</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="p-2 bg-slate-50 rounded-lg text-center">
                          <p className="text-sm font-bold text-slate-700">
                            {advancedAnalysis.histogram.colorEntropy.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">Color Entropy</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-lg text-center">
                          <p className="text-sm font-bold text-slate-700">
                            {advancedAnalysis.histogram.colorContrast.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-500">Color Contrast</p>
                        </div>
                      </div>
                    </div>

                    {/* ML Feature Vector */}
                    <div className="bg-white/70 rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-2 text-sm">ML-Ready Feature Vector</h5>
                      <p className="text-xs text-slate-500 mb-3">
                        {advancedAnalysis.mlFeatures.featureNames.length} features extracted for model training
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {advancedAnalysis.mlFeatures.featureNames.map((name, i) => (
                          <span
                            key={name}
                            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
                            title={`${name}: ${advancedAnalysis.mlFeatures.features[i]?.toFixed(4)}`}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Biomass Estimation Breakdown */}
                    <div className="bg-white/70 rounded-lg p-4">
                      <h5 className="font-medium text-slate-900 mb-3 text-sm">Multi-Feature Biomass Estimation</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg text-center">
                          <p className="text-sm font-bold text-emerald-700">{advancedAnalysis.biomass.green.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Green (kg/ha)</p>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-center">
                          <p className="text-sm font-bold text-amber-700">{advancedAnalysis.biomass.dead.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Dead (kg/ha)</p>
                        </div>
                        <div className="p-2 bg-lime-50 rounded-lg text-center">
                          <p className="text-sm font-bold text-lime-700">{advancedAnalysis.biomass.clover.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Clover (kg/ha)</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-center">
                          <p className="text-sm font-bold text-blue-700">{(advancedAnalysis.biomass.confidence * 100).toFixed(0)}%</p>
                          <p className="text-xs text-slate-500">Confidence</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 text-center">
                        Method: {advancedAnalysis.biomass.method}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Mode Badge */}
            <div className="flex items-center justify-between text-xs text-slate-500 p-3 bg-slate-50 rounded-lg">
              <span>
                Analysis mode:{" "}
                <span className="font-medium text-slate-700">{entry.result.analysis_mode || "API"}</span>
              </span>
              {entry.result.processing_time_ms && <span>Processing: {entry.result.processing_time_ms}ms</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function InfoScreen() {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Model Information</h2>

        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-3">PastureAI v2.0 Advanced</h3>
            <p className="text-slate-600 mb-4">
              Advanced biomass estimation system using multi-modal AI analysis with vegetation indices, texture
              analysis, and spatial metrics for comprehensive pasture assessment.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Model Version</p>
                <p className="font-medium">v2.0-advanced</p>
              </div>
              <div>
                <p className="text-slate-500">Analysis Type</p>
                <p className="font-medium">Multi-spectral Simulation</p>
              </div>
              <div>
                <p className="text-slate-500">Vegetation Indices</p>
                <p className="font-medium">NDVI, GNDVI, EVI, SAVI, MSAVI</p>
              </div>
              <div>
                <p className="text-slate-500">Texture Metrics</p>
                <p className="font-medium">GLCM, Entropy, Fragmentation</p>
              </div>
            </div>
          </div>

          {/* Open Source Tools Section */}
          <div className="border border-emerald-200 rounded-xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Open Source Tools & Free Analysis
            </h3>
            <p className="text-emerald-700 mb-4 text-sm">
              PastureAI leverages free, open-source tools for client-side analysis that runs entirely in your browser.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Client-Side Processing</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>Canvas API for image manipulation</li>
                  <li>GLCM texture analysis algorithms</li>
                  <li>Pseudo-NDVI from RGB channels</li>
                  <li>Color-based vegetation segmentation</li>
                </ul>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Hybrid AI Enhancement</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>Llama 3.2 Vision (open-source)</li>
                  <li>Mistral for recommendations</li>
                  <li>Local analysis + cloud validation</li>
                  <li>Works offline in client mode</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/40 rounded-lg">
              <p className="text-xs text-emerald-800">
                <strong>Privacy First:</strong> In client-side mode, your images never leave your device. All processing
                happens locally using open-source algorithms based on remote sensing research.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-3">Analysis Pipeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-900">Image Preprocessing</p>
                  <p className="text-sm text-slate-500">Normalization, radiometric correction, and band extraction</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-900">Vegetation Index Computation</p>
                  <p className="text-sm text-slate-500">NDVI, GNDVI, EVI, SAVI calculation from spectral bands</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium text-slate-900">Texture & Spatial Analysis</p>
                  <p className="text-sm text-slate-500">GLCM metrics, patch detection, and fragmentation analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium text-slate-900">AI-Powered Estimation</p>
                  <p className="text-sm text-slate-500">Biomass prediction and recommendation generation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ecological Tips Quick Reference */}
          <div className="border border-teal-200 rounded-xl p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
            <h3 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Reference: Ecological Practices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ecologicalTips.slice(0, 3).map((tip) => (
                <div key={tip.id} className="bg-white/60 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <tip.icon className="w-4 h-4 text-teal-600" />
                    <span className="font-medium text-sm text-slate-900">{tip.title}</span>
                  </div>
                  <p className="text-xs text-slate-600">{tip.benefit}</p>
                </div>
              ))}
            </div>
            <Link
              href="/#tips"
              className="mt-3 inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800 font-medium"
            >
              View all ecological tips
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  function SettingsScreen() {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Settings</h2>

        <div className="space-y-6">
          <div className="border border-slate-200 rounded-xl p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4">Data Management</h3>
            <button
              onClick={() => {
                if (confirm("Clear all history? This cannot be undone.")) {
                  setHistory([])
                  setResult(null)
                }
              }}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              Clear History
            </button>
            <p className="text-sm text-slate-500 mt-2">{history.length} analysis records stored locally</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4">Analysis Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Enable Advanced Metrics</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-500 rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Auto-generate Heatmaps</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-500 rounded" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-slate-700">Show Confidence Scores</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-500 rounded" />
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function LivestockScreen() {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Livestock Management</h2>
          <p className="text-slate-500">
            Optimize stocking rates, nutrition, and welfare based on pasture analysis
          </p>
        </div>

        {!clientAnalysisResult && (
          <div className="border border-amber-200 rounded-xl p-6 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 mb-1">No pasture analysis available</p>
                <p className="text-sm text-amber-700">
                  Please upload and analyze a pasture image first to get livestock recommendations.
                </p>
                <button
                  onClick={() => setScreen("upload")}
                  className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  Upload Pasture Image
                </button>
              </div>
            </div>
          </div>
        )}

        {clientAnalysisResult && (
          <div className="space-y-6">
            {/* Livestock Selection & Parameters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-6 bg-white">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Beef className="w-5 h-5 text-emerald-500" />
                  Livestock Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Livestock Type</label>
<select
                              value={LIVESTOCK_DATABASE.findIndex((l) => l.id === selectedLivestock.id)}
                              onChange={(e) => setSelectedLivestock(LIVESTOCK_DATABASE[Number.parseInt(e.target.value)])}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                              {LIVESTOCK_DATABASE.map((livestock, idx) => (
                                <option key={livestock.id} value={idx}>
                                  {livestock.emoji} {livestock.name}
                                </option>
                              ))}
                            </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Head Count: {headCount}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={headCount}
                      onChange={(e) => setHeadCount(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Paddock Size: {paddockSize} ha
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={paddockSize}
                      onChange={(e) => setPaddockSize(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Paddocks: {totalPaddocks}
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={totalPaddocks}
                      onChange={(e) => setTotalPaddocks(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-6 bg-white">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-500" />
                  Quick Metrics
                </h3>
<div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-500 mb-1">Avg Weight</p>
                              <p className="text-lg font-bold text-slate-900">{selectedLivestock.avgWeight} kg</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-500 mb-1">Daily Intake</p>
                              <p className="text-lg font-bold text-slate-900">
                                {((selectedLivestock.avgWeight * selectedLivestock.dailyIntake) / 100).toFixed(1)} kg DM
                              </p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-500 mb-1">Total Area</p>
                              <p className="text-lg font-bold text-slate-900">{paddockSize * totalPaddocks} ha</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-500 mb-1">Density</p>
                              <p className="text-lg font-bold text-slate-900">
                                {(headCount / (paddockSize * totalPaddocks)).toFixed(1)} /ha
                              </p>
                            </div>
                          </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: "stocking", label: "Stocking Rate", icon: Scale },
                  { id: "nutrition", label: "Nutrition", icon: Wheat },
                  { id: "welfare", label: "Welfare", icon: Heart },
                  { id: "rotation", label: "Rotation Plan", icon: Calendar },
                  { id: "budget", label: "Feed Budget", icon: DollarSign },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setLivestockTab(tab.id as LivestockTab)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      livestockTab === tab.id
                        ? "border-emerald-500 text-emerald-700 font-medium"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="border border-slate-200 rounded-xl p-6 bg-white">
{livestockTab === "stocking" && livestockAnalysis.stocking && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Stocking Rate Analysis</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-emerald-50 rounded-lg">
                                <p className="text-sm text-emerald-700 mb-1">Optimal Head Count</p>
                                <p className="text-2xl font-bold text-emerald-900">
                                  {livestockAnalysis.stocking.optimalHeadCount}
                                </p>
                                <p className="text-xs text-emerald-600">
                                  Range: {livestockAnalysis.stocking.minHeadCount}-
                                  {livestockAnalysis.stocking.maxHeadCount}
                                </p>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700 mb-1">Grazing Days</p>
                                <p className="text-2xl font-bold text-slate-900">
                                  {livestockAnalysis.stocking.grazingDaysAvailable}
                                </p>
                                <p className="text-xs text-slate-600">at current stocking</p>
                              </div>
                              <div className="p-4 bg-amber-50 rounded-lg">
                                <p className="text-sm text-amber-700 mb-1">Utilization</p>
                                <p className="text-2xl font-bold text-amber-900">
                                  {livestockAnalysis.stocking.utilizationRate}%
                                </p>
                                <p className="text-xs text-amber-600">of optimal capacity</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700 mb-1">Daily Intake (Total)</p>
                                <p className="text-xl font-bold text-blue-900">
                                  {livestockAnalysis.stocking.dailyIntakeTotal} kg DM
                                </p>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-purple-700 mb-1">Supplement Needed</p>
                                <p className="text-xl font-bold text-purple-900">
                                  {livestockAnalysis.stocking.supplementaryFeedNeeded} kg
                                </p>
                              </div>
                            </div>
                            <div
                              className={`p-4 rounded-lg ${
                                livestockAnalysis.stocking.overgraze_risk === "low"
                                  ? "bg-emerald-50 border border-emerald-200"
                                  : livestockAnalysis.stocking.overgraze_risk === "medium"
                                    ? "bg-amber-50 border border-amber-200"
                                    : "bg-red-50 border border-red-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {livestockAnalysis.stocking.overgraze_risk === "low" ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                                )}
                                <p
                                  className={`font-medium ${
                                    livestockAnalysis.stocking.overgraze_risk === "low"
                                      ? "text-emerald-900"
                                      : livestockAnalysis.stocking.overgraze_risk === "medium"
                                        ? "text-amber-900"
                                        : "text-red-900"
                                  }`}
                                >
                                  Overgrazing Risk: {livestockAnalysis.stocking.overgraze_risk.toUpperCase()}
                                </p>
                              </div>
                              <p
                                className={`text-sm ${
                                  livestockAnalysis.stocking.overgraze_risk === "low"
                                    ? "text-emerald-700"
                                    : livestockAnalysis.stocking.overgraze_risk === "medium"
                                      ? "text-amber-700"
                                      : "text-red-700"
                                }`}
                              >
                                {livestockAnalysis.stocking.overgraze_risk === "low"
                                  ? "Current stocking is sustainable. Pasture can recover adequately."
                                  : livestockAnalysis.stocking.overgraze_risk === "medium"
                                    ? "Consider reducing head count or rotation frequency."
                                    : "Immediate action required! Reduce stocking or provide supplementary feed."}
                              </p>
                            </div>
                          </div>
                        )}

{livestockTab === "nutrition" && livestockAnalysis.nutrition && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Nutritional Analysis</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Crude Protein</p>
                                <p className="text-xl font-bold text-slate-900">
                                  {livestockAnalysis.nutrition.crudeProtein.toFixed(1)}%
                                </p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Energy (MJ/kg)</p>
                                <p className="text-xl font-bold text-slate-900">
                                  {livestockAnalysis.nutrition.metabolizableEnergy.toFixed(1)}
                                </p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Digestibility</p>
                                <p className="text-xl font-bold text-slate-900">
                                  {livestockAnalysis.nutrition.digestibility.toFixed(0)}%
                                </p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Fiber (NDF)</p>
                                <p className="text-xl font-bold text-slate-900">
                                  {livestockAnalysis.nutrition.fiberContent.toFixed(0)}%
                                </p>
                              </div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                              <p className="font-medium text-emerald-900 mb-2">
                                Forage Quality Grade: {livestockAnalysis.nutrition.qualityGrade}
                              </p>
                              <div className="grid grid-cols-3 gap-2 mt-3">
                                <div className="text-center">
                                  <p className="text-xs text-emerald-600">Calcium</p>
                                  <p className="text-sm font-medium capitalize">
                                    {livestockAnalysis.nutrition.mineralBalance.calcium}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-emerald-600">Phosphorus</p>
                                  <p className="text-sm font-medium capitalize">
                                    {livestockAnalysis.nutrition.mineralBalance.phosphorus}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-emerald-600">Magnesium</p>
                                  <p className="text-sm font-medium capitalize">
                                    {livestockAnalysis.nutrition.mineralBalance.magnesium}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="border border-slate-200 rounded-lg p-4">
                              <p className="text-sm font-medium text-slate-700 mb-3">
                                Suitability for {selectedLivestock.name}
                              </p>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all"
                                    style={{
                                      width: `${livestockAnalysis.nutrition.suitability[selectedLivestock.id] || 0}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-lg font-bold text-slate-900">
                                  {livestockAnalysis.nutrition.suitability[selectedLivestock.id] || 0}%
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

{livestockTab === "welfare" && livestockAnalysis.welfare && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Animal Welfare Indicators</h3>

                            {/* Temperature Slider */}
                            <div className="p-4 border border-slate-200 rounded-lg">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Ambient Temperature: {ambientTemp}°C
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="45"
                                value={ambientTemp}
                                onChange={(e) => setAmbientTemp(Number.parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div
                                className={`p-4 rounded-lg ${
                                  livestockAnalysis.welfare.heatStressRisk === "low"
                                    ? "bg-emerald-50"
                                    : livestockAnalysis.welfare.heatStressRisk === "medium"
                                      ? "bg-amber-50"
                                      : "bg-red-50"
                                }`}
                              >
                                <p className="text-sm text-slate-700 mb-3">Heat Stress Risk</p>
                                <div className="flex items-center gap-3">
                                  <Thermometer
                                    className={`w-5 h-5 ${
                                      livestockAnalysis.welfare.heatStressRisk === "low"
                                        ? "text-emerald-600"
                                        : livestockAnalysis.welfare.heatStressRisk === "medium"
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <p className="text-lg font-bold text-slate-900 uppercase">
                                      {livestockAnalysis.welfare.heatStressRisk}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {selectedLivestock.heatTolerance} heat tolerance
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700 mb-3">Grazing Comfort</p>
                                <div className="flex items-center gap-3">
                                  <Target className="w-5 h-5 text-slate-500" />
                                  <div className="flex-1">
                                    <p className="text-lg font-bold text-slate-900">
                                      {livestockAnalysis.welfare.grazingComfort}/100
                                    </p>
                                    <div className="h-2 bg-slate-200 rounded-full mt-1">
                                      <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${livestockAnalysis.welfare.grazingComfort}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <p className="text-xs text-slate-500 mb-1">Shade Availability</p>
                                <p className="text-lg font-bold text-slate-900 capitalize">
                                  {livestockAnalysis.welfare.shadeAvailability}
                                </p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <p className="text-xs text-slate-500 mb-1">Est. Weight Gain</p>
                                <p className="text-lg font-bold text-slate-900">
                                  {livestockAnalysis.welfare.estimatedWeightGain} kg/day
                                </p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <p className="text-xs text-slate-500 mb-1">Milk Production</p>
                                <p
                                  className={`text-lg font-bold ${
                                    livestockAnalysis.welfare.milkProductionImpact >= 0
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {livestockAnalysis.welfare.milkProductionImpact > 0 ? "+" : ""}
                                  {livestockAnalysis.welfare.milkProductionImpact}%
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-medium text-slate-700">Recommendations:</p>
                              {livestockAnalysis.welfare.recommendations.map((rec, idx) => (
                                <div
                                  key={idx}
                                  className={`flex items-start gap-2 p-3 rounded-lg ${
                                    rec.includes("favorable") ? "bg-emerald-50" : "bg-amber-50"
                                  }`}
                                >
                                  {rec.includes("favorable") ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                  )}
                                  <p
                                    className={`text-sm ${rec.includes("favorable") ? "text-emerald-800" : "text-amber-800"}`}
                                  >
                                    {rec}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

              {livestockTab === "rotation" && livestockAnalysis.rotation && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Rotational Grazing Plan</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-4 bg-emerald-50 rounded-lg">
                                <p className="text-sm text-emerald-700 mb-1">Grazing Period</p>
                                <p className="text-2xl font-bold text-emerald-900">
                                  {livestockAnalysis.rotation.grazingPeriodDays}
                                </p>
                                <p className="text-xs text-emerald-600">days per paddock</p>
                              </div>
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700 mb-1">Rest Period</p>
                                <p className="text-2xl font-bold text-blue-900">
                                  {livestockAnalysis.rotation.restPeriodDays}
                                </p>
                                <p className="text-xs text-blue-600">days recovery</p>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-purple-700 mb-1">Total Paddocks</p>
                                <p className="text-2xl font-bold text-purple-900">
                                  {livestockAnalysis.rotation.totalPaddocks}
                                </p>
                                <p className="text-xs text-purple-600">in rotation</p>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-700 mb-1">Annual Rotations</p>
                                <p className="text-2xl font-bold text-slate-900">
                                  {livestockAnalysis.rotation.annualRotations}
                                </p>
                                <p className="text-xs text-slate-600">cycles/year</p>
                              </div>
                            </div>

                            <div className="border border-slate-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-medium text-slate-900">Current Position</p>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm text-slate-600">
                                    {livestockAnalysis.rotation.daysUntilRotation} days until rotation
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-wrap">
                                {Array.from({ length: livestockAnalysis.rotation.totalPaddocks }).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold ${
                                      idx + 1 === livestockAnalysis.rotation.currentPaddock
                                        ? "bg-emerald-500 text-white"
                                        : idx + 1 < (livestockAnalysis.rotation?.currentPaddock ?? 1)
                                          ? "bg-slate-200 text-slate-500"
                                          : "bg-slate-100 text-slate-400"
                                    }`}
                                  >
                                    P{idx + 1}
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-slate-500 mt-3">
                                Currently in Paddock {livestockAnalysis.rotation.currentPaddock} - Day{" "}
                                {livestockAnalysis.rotation.daysInCurrentPaddock + 1} of{" "}
                                {livestockAnalysis.rotation.grazingPeriodDays}
                              </p>
                            </div>

                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-emerald-900">Efficiency Score</p>
                                <p className="text-2xl font-bold text-emerald-700">
                                  {livestockAnalysis.rotation.efficiencyScore}%
                                </p>
                              </div>
                              <div className="h-2 bg-emerald-100 rounded-full mt-2">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${livestockAnalysis.rotation.efficiencyScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

              {livestockTab === "budget" && livestockAnalysis.budget && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-slate-900">Feed Budget Analysis</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-4 bg-emerald-50 rounded-lg">
                                <p className="text-sm text-emerald-700 mb-1">Daily Requirement</p>
                                <p className="text-2xl font-bold text-emerald-900">
                                  {livestockAnalysis.budget.dailyRequirement}
                                </p>
                                <p className="text-xs text-emerald-600">kg DM/day</p>
                              </div>
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700 mb-1">Weekly Requirement</p>
                                <p className="text-2xl font-bold text-blue-900">
                                  {livestockAnalysis.budget.weeklyRequirement}
                                </p>
                                <p className="text-xs text-blue-600">kg DM</p>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-purple-700 mb-1">Monthly Requirement</p>
                                <p className="text-2xl font-bold text-purple-900">
                                  {livestockAnalysis.budget.monthlyRequirement}
                                </p>
                                <p className="text-xs text-purple-600">kg DM</p>
                              </div>
                              <div className="p-4 bg-amber-50 rounded-lg">
                                <p className="text-sm text-amber-700 mb-1">Pasture Contribution</p>
                                <p className="text-2xl font-bold text-amber-900">
                                  {livestockAnalysis.budget.pastureContribution}%
                                </p>
                                <p className="text-xs text-amber-600">of needs</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div
                                className={`p-4 rounded-lg ${
                                  livestockAnalysis.budget.supplementNeeded === 0
                                    ? "bg-emerald-50 border border-emerald-200"
                                    : "bg-amber-50 border border-amber-200"
                                }`}
                              >
                                <p className="text-sm font-medium mb-2">Supplementary Feed</p>
                                <p className="text-2xl font-bold">
                                  {livestockAnalysis.budget.supplementNeeded} kg/day
                                </p>
                                <p className="text-sm mt-1">
                                  Est. cost: ${livestockAnalysis.budget.supplementCost.toFixed(2)}/day
                                </p>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-sm font-medium mb-2">Feed Conversion</p>
                                <p className="text-2xl font-bold text-slate-900">
                                  {livestockAnalysis.budget.feedConversionRatio}:1
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  Cost per kg gain: ${livestockAnalysis.budget.costPerKgGain.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div
                              className={`p-4 rounded-lg ${
                                livestockAnalysis.budget.pastureContribution >= 100
                                  ? "bg-emerald-50 border border-emerald-200"
                                  : livestockAnalysis.budget.pastureContribution >= 70
                                    ? "bg-blue-50 border border-blue-200"
                                    : "bg-red-50 border border-red-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {livestockAnalysis.budget.pastureContribution >= 100 ? (
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                                )}
                                <p
                                  className={`font-medium ${
                                    livestockAnalysis.budget.pastureContribution >= 100
                                      ? "text-emerald-900"
                                      : livestockAnalysis.budget.pastureContribution >= 70
                                        ? "text-blue-900"
                                        : "text-red-900"
                                  }`}
                                >
                                  Feed Status:{" "}
                                  {livestockAnalysis.budget.pastureContribution >= 100
                                    ? "SURPLUS"
                                    : livestockAnalysis.budget.pastureContribution >= 70
                                      ? "ADEQUATE"
                                      : "DEFICIT"}
                                </p>
                              </div>
                              <p
                                className={`text-sm ${
                                  livestockAnalysis.budget.pastureContribution >= 100
                                    ? "text-emerald-700"
                                    : livestockAnalysis.budget.pastureContribution >= 70
                                      ? "text-blue-700"
                                      : "text-red-700"
                                }`}
                              >
                                {livestockAnalysis.budget.pastureContribution >= 100
                                  ? "Pasture is providing all nutritional needs. Consider making hay or increasing stock."
                                  : livestockAnalysis.budget.pastureContribution >= 70
                                    ? "Pasture is meeting most needs. Light supplementation recommended."
                                    : "Significant supplementation required. Consider reducing stock or improving pasture."}
                              </p>
                            </div>
                          </div>
                        )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobileHeader />
      <MobileMenu />

      <div className="flex flex-1">
        <LeftNav />

        <main className="flex-1 flex flex-col overflow-hidden">
          <DesktopHeader />

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 text-center">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-900 mb-2">Analyzing Image</p>
                <p className="text-sm text-slate-500 mb-4">Computing vegetation indices and spatial metrics...</p>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

<div className="flex-1 overflow-auto">
          {screen === "upload" && <UploadScreen />}
          {screen === "livestock" && <LivestockScreen />}
          {screen === "history" && <HistoryScreen />}
          {screen === "result" && <ResultScreen entry={result} />}
          {screen === "info" && <InfoScreen />}
          {screen === "settings" && <SettingsScreen />}
        </div>
        </main>
      </div>
    </div>
  )
}
