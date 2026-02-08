"use client"

import { useState } from "react"
import { Weight, Calendar, Sprout, DollarSign, Loader2, Sparkles } from "lucide-react"
import type { BiomassAnalysis } from "@/lib/types"

const sampleImages = [
  {
    id: "pasture1",
    src: "/healthy-green-pasture-grassland-thumbnail.jpg",
    label: "Sample 1 - Healthy",
  },
  {
    id: "pasture2",
    src: "/overgrazed-dry-pasture-land-thumbnail.jpg",
    label: "Sample 2 - Overgrazed",
  },
  {
    id: "pasture3",
    src: "/optimal-lush-green-grass-field-thumbnail.jpg",
    label: "Sample 3 - Optimal",
  },
  {
    id: "pasture4",
    src: "/fair-condition-pasture-meadow-thumbnail.jpg",
    label: "Sample 4 - Fair",
  },
]

const mainImages: Record<string, string> = {
  pasture1: "/healthy-green-pasture-grassland-farm-aerial-view.jpg",
  pasture2: "/overgrazed-dry-pasture-farmland-aerial-view.jpg",
  pasture3: "/optimal-lush-green-grass-field-aerial-view.jpg",
  pasture4: "/fair-condition-pasture-meadow-aerial-view.jpg",
}

export function LiveDemoSection() {
  const [selectedImage, setSelectedImage] = useState(sampleImages[0])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<BiomassAnalysis | null>(null)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalysisResults(null)

    try {
      const formData = new FormData()
      formData.append("imageUrl", mainImages[selectedImage.id])

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()
      setAnalysisResults(result.data)
    } catch (error) {
      console.error("Analysis error:", error)
      alert("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageSelect = (image: (typeof sampleImages)[0]) => {
    setSelectedImage(image)
    setAnalysisResults(null)
  }

  const getHealthColor = (health?: string) => {
    switch (health) {
      case "poor":
        return "bg-red-100 text-red-700"
      case "fair":
        return "bg-yellow-100 text-yellow-700"
      case "good":
        return "bg-green-100 text-green-700"
      case "excellent":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <section id="app-demo" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-dark-green relative inline-block pb-4">
            Try PastureAI Live Demo
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-light-green rounded-sm" />
          </h2>
          <p className="text-text-light mt-4 max-w-xl mx-auto">
            Experience our AI-powered biomass estimation technology in action
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl overflow-hidden shadow-xl">
          {/* Sidebar */}
          <div className="lg:w-[300px] bg-gray-100 p-6">
            <h3 className="font-heading font-semibold text-lg text-dark-green mb-4">Quick Analysis</h3>

            {/* Sample Images */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {sampleImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleImageSelect(image)}
                  className={`bg-white rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md ${
                    selectedImage.id === image.id ? "ring-2 ring-primary-green" : ""
                  }`}
                >
                  <img src={image.src || "/placeholder.svg"} alt={image.label} className="w-full h-20 object-cover" />
                  <span className="block p-2 text-xs text-text-light text-center">{image.label}</span>
                </button>
              ))}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-primary-green text-white py-3 rounded-full font-semibold hover:bg-dark-green transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze with AI
                </>
              )}
            </button>

            {analysisResults && (
              <div className="mt-4 text-center">
                <span className="text-xs text-text-light">Processed in {analysisResults.processing_time_ms}ms</span>
              </div>
            )}
          </div>

          {/* Main Demo Area */}
          <div className="flex-1 p-6">
            {/* Image Viewer */}
            <div
              className="h-[300px] rounded-2xl relative overflow-hidden bg-cover bg-center mb-6"
              style={{ backgroundImage: `url('${mainImages[selectedImage.id]}')` }}
            >
              {analysisResults && (
                <div className="absolute top-5 left-5 bg-white/95 p-4 rounded-xl shadow-md max-w-[280px]">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-heading font-semibold text-dark-green">AI Analysis</h4>
                    <span className="text-xs bg-primary-green/10 text-primary-green px-2 py-0.5 rounded-full">
                      {Math.round(analysisResults.confidence_score * 100)}%
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-light">Biomass Density:</span>
                      <span className="font-semibold text-dark-green">
                        {analysisResults.metrics.biomass_density.toFixed(1)} g/m²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-light">Coverage:</span>
                      <span className="font-semibold text-dark-green">
                        {analysisResults.metrics.coverage_percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-light">Greenness Index:</span>
                      <span className="font-semibold text-dark-green">
                        {analysisResults.metrics.greenness_index.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 text-center">
                    <Loader2 className="w-10 h-10 text-primary-green animate-spin mx-auto mb-3" />
                    <p className="text-dark-green font-medium">AI analyzing pasture...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <h3 className="font-heading font-semibold text-lg text-dark-green mb-4">Analysis Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Weight,
                  title: "Biomass Estimate",
                  value: analysisResults ? `${analysisResults.metrics.biomass_density.toFixed(1)} g/m²` : "— g/m²",
                  status: analysisResults?.recommendations.grazing_recommendation.slice(0, 30) || "Run analysis to see",
                  statusColor: analysisResults
                    ? getHealthColor(analysisResults.metrics.pasture_health)
                    : "bg-gray-100 text-gray-600",
                },
                {
                  icon: Calendar,
                  title: "Grazing Schedule",
                  value: analysisResults ? `${analysisResults.recommendations.grazing_duration_days} days` : "— days",
                  status: analysisResults
                    ? `Rest: ${analysisResults.recommendations.rest_period_days} days`
                    : "Recommended duration",
                  statusColor: "bg-gray-100 text-gray-600",
                },
                {
                  icon: Sprout,
                  title: "Carbon Impact",
                  value: analysisResults
                    ? `+${analysisResults.sustainability.carbon_sequestration_kg.toFixed(1)} kg`
                    : "— kg",
                  status: "Annual sequestration",
                  statusColor: "bg-blue-100 text-blue-700",
                },
                {
                  icon: DollarSign,
                  title: "Feed Savings",
                  value: analysisResults
                    ? `$${analysisResults.recommendations.feed_savings_estimate.toFixed(0)}`
                    : "$—",
                  status: "Monthly savings potential",
                  statusColor: "bg-green-100 text-green-700",
                },
              ].map((result, i) => (
                <div key={i} className="flex items-center gap-4 bg-lighter-green/30 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
                    <result.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-dark-green text-sm">{result.title}</h4>
                    <p className="text-xl font-bold text-dark-green">{result.value}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${result.statusColor}`}>{result.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Recommendation */}
            {analysisResults && (
              <div className="mt-6 bg-primary-green/5 border border-primary-green/20 rounded-xl p-4">
                <h4 className="font-heading font-semibold text-dark-green mb-2">AI Recommendation</h4>
                <p className="text-text-dark text-sm">{analysisResults.recommendations.grazing_recommendation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
