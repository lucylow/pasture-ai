"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Camera, WifiOff, Users, Leaf, Upload, CheckCircle, Loader2, MessageCircle, Send, X, Beef } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import type { BiomassAnalysis } from "@/lib/types"

const tabs = [
  { id: "image-analysis", label: "Image Analysis", icon: Camera },
  { id: "livestock-ai", label: "Livestock AI", icon: Beef },
  { id: "offline-mode", label: "Offline Mode", icon: WifiOff },
  { id: "community", label: "Community", icon: Users },
  { id: "sustainability", label: "Sustainability", icon: Leaf },
]

export function SolutionSection() {
  const [activeTab, setActiveTab] = useState("image-analysis")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<BiomassAnalysis | null>(null)
  const [showChat, setShowChat] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat({
    api: "/api/chat",
    body: { context: analysisResults },
  })

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.match("image.*")) {
      alert("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      setUploadedImage(event.target?.result as string)
      setIsAnalyzing(true)
      setAnalysisResults(null)

      try {
        const formData = new FormData()
        formData.append("image", file)

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
    reader.readAsDataURL(file)
  }

  const resetUpload = () => {
    setUploadedImage(null)
    setAnalysisResults(null)
    setShowChat(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "poor":
        return "text-red-500"
      case "fair":
        return "text-yellow-500"
      case "good":
        return "text-green-500"
      case "excellent":
        return "text-emerald-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <section id="solution" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-dark-green relative inline-block pb-4">
            Our AI-Powered Solution
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-light-green rounded-sm" />
          </h2>
          <p className="text-text-light mt-4 max-w-xl mx-auto">
            {"Harnessing CSIRO's Image2Biomass research with advanced AI for accessible farming technology"}
          </p>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          {/* Tabs */}
          <div className="flex flex-wrap bg-gray-100 p-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== "image-analysis") resetUpload()
                }}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary-green text-white"
                    : "text-text-light hover:bg-light-green/10 hover:text-primary-green"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8 md:p-12">
            {activeTab === "image-analysis" && (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Upload Area */}
                <div
                  className={`flex-1 w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    uploadedImage
                      ? "border-primary-green bg-lighter-green/30"
                      : "border-light-green bg-lighter-green/20 hover:border-primary-green hover:bg-lighter-green/30"
                  }`}
                  onClick={() => !uploadedImage && fileInputRef.current?.click()}
                >
                  {!uploadedImage ? (
                    <>
                      <Upload className="w-16 h-16 text-light-green mx-auto mb-4" />
                      <h3 className="font-heading font-semibold text-xl text-dark-green mb-2">Upload Pasture Image</h3>
                      <p className="text-text-light mb-4">Drag & drop or click to upload</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button className="bg-light-green text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-green transition-colors">
                        Choose Image
                      </button>
                    </>
                  ) : (
                    <div className="relative">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded pasture"
                        className="w-full max-h-[300px] object-cover rounded-xl"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          resetUpload()
                        }}
                        className="absolute top-2 right-2 bg-white/90 text-dark-green px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>

                {/* Results Area */}
                <div className="flex-1 w-full min-h-[300px] bg-gray-50 rounded-2xl flex flex-col items-center justify-center p-6">
                  {!uploadedImage && (
                    <p className="text-text-light text-center">Upload an image to see AI analysis results</p>
                  )}
                  {isAnalyzing && (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
                      <p className="text-text-light">AI analyzing pasture...</p>
                      <p className="text-xs text-text-light/60 mt-2">This may take a few seconds</p>
                    </div>
                  )}
                  {analysisResults && (
                    <div className="w-full space-y-4">
                      {/* Main Results Card */}
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-heading font-semibold text-lg text-dark-green">AI Analysis Results</h4>
                          <span className="text-xs bg-primary-green/10 text-primary-green px-2 py-1 rounded-full">
                            {Math.round(analysisResults.confidence_score * 100)}% confidence
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-text-light">Biomass Density:</span>
                            <span className="font-semibold text-dark-green">
                              {analysisResults.metrics.biomass_density.toFixed(1)} g/m²
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-text-light">Pasture Health:</span>
                            <span
                              className={`font-semibold capitalize ${getHealthColor(analysisResults.metrics.pasture_health)}`}
                            >
                              {analysisResults.metrics.pasture_health}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <span className="text-text-light">Ground Coverage:</span>
                            <span className="font-semibold text-dark-green">
                              {analysisResults.metrics.coverage_percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-text-light">Greenness Index:</span>
                            <span className="font-semibold text-dark-green">
                              {analysisResults.metrics.greenness_index.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations Card */}
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <h4 className="font-heading font-semibold text-dark-green mb-3">Recommendations</h4>
                        <p className="text-text-dark text-sm mb-4">
                          {analysisResults.recommendations.grazing_recommendation}
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-lighter-green/30 p-3 rounded-lg">
                            <span className="text-text-light block">Grazing Duration</span>
                            <span className="font-semibold text-dark-green">
                              {analysisResults.recommendations.grazing_duration_days} days
                            </span>
                          </div>
                          <div className="bg-lighter-green/30 p-3 rounded-lg">
                            <span className="text-text-light block">Rest Period</span>
                            <span className="font-semibold text-dark-green">
                              {analysisResults.recommendations.rest_period_days} days
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sustainability Card */}
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <h4 className="font-heading font-semibold text-dark-green mb-3">Sustainability Impact</h4>
                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                          <div>
                            <span className="text-2xl font-bold text-primary-green block">
                              {analysisResults.sustainability.carbon_sequestration_kg.toFixed(1)}
                            </span>
                            <span className="text-text-light text-xs">kg CO₂/year</span>
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-blue-500 block">
                              {analysisResults.sustainability.water_retention_mm.toFixed(0)}
                            </span>
                            <span className="text-text-light text-xs">mm water</span>
                          </div>
                          <div>
                            <span className="text-2xl font-bold text-earth-brown block">
                              {(analysisResults.sustainability.soil_health_index * 100).toFixed(0)}%
                            </span>
                            <span className="text-text-light text-xs">soil health</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Chat Button */}
                      <button
                        onClick={() => setShowChat(!showChat)}
                        className="w-full flex items-center justify-center gap-2 bg-primary-green text-white py-3 rounded-full font-semibold hover:bg-dark-green transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {showChat ? "Hide AI Assistant" : "Ask AI Assistant"}
                      </button>

                      {/* AI Chat Panel */}
                      {showChat && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                          <div className="bg-primary-green text-white px-4 py-3 flex items-center justify-between">
                            <span className="font-semibold">PastureAI Assistant</span>
                            <button onClick={() => setShowChat(false)}>
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="h-[200px] overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && (
                              <p className="text-text-light text-sm text-center">
                                Ask me anything about your pasture analysis!
                              </p>
                            )}
                            {messages.map((msg, i) => (
                              <div
                                key={i}
                                className={`p-3 rounded-lg text-sm ${
                                  msg.role === "user" ? "bg-primary-green/10 ml-8" : "bg-gray-100 mr-8"
                                }`}
                              >
                                {msg.content}
                              </div>
                            ))}
                            {isChatLoading && (
                              <div className="flex items-center gap-2 text-text-light text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Thinking...
                              </div>
                            )}
                          </div>
                          <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
                            <input
                              type="text"
                              value={input}
                              onChange={handleInputChange}
                              placeholder="Ask about your results..."
                              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                            />
                            <button
                              type="submit"
                              disabled={isChatLoading || !input.trim()}
                              className="bg-primary-green text-white p-2 rounded-lg hover:bg-dark-green disabled:opacity-50 transition-colors"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </form>
                        </div>
                      )}

                      <p className="text-xs text-center text-text-light/60">
                        Processed in {analysisResults.processing_time_ms}ms | Model: {analysisResults.model_version}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "livestock-ai" && (
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-dark-green mb-4">
                    AI-Powered Livestock Management
                  </h3>
                  <p className="text-text-dark mb-6">
                    Optimize your livestock operations with intelligent stocking rate calculations, nutritional analysis,
                    and animal welfare monitoring - all powered by advanced AI algorithms.
                  </p>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Stocking Rate Calculator",
                        desc: "AI determines optimal head count based on pasture biomass and forage quality",
                      },
                      {
                        title: "Nutritional Analysis",
                        desc: "Estimate crude protein, energy content, and mineral balance from pasture data",
                      },
                      {
                        title: "Animal Welfare Monitoring",
                        desc: "Heat stress risk, grazing comfort, and welfare recommendations",
                      },
                      {
                        title: "Rotational Grazing Planner",
                        desc: "Automated paddock rotation schedules optimized for recovery",
                      },
                      {
                        title: "Feed Budget Analysis",
                        desc: "Calculate supplementary feed needs and cost per kg gain",
                      },
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-dark-green">{item.title}</span>
                          <p className="text-sm text-text-light">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h4 className="font-heading font-semibold text-dark-green mb-4">Supported Livestock</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { emoji: "🐄", name: "Dairy Cattle", intake: "22.8 kg DM/day" },
                      { emoji: "🐂", name: "Beef Cattle", intake: "13.8 kg DM/day" },
                      { emoji: "🐑", name: "Sheep", intake: "2.1 kg DM/day" },
                      { emoji: "🐐", name: "Goats", intake: "2.0 kg DM/day" },
                      { emoji: "🐴", name: "Horses", intake: "10.0 kg DM/day" },
                      { emoji: "🦙", name: "Alpacas/Llamas", intake: "1.5 kg DM/day" },
                    ].map((animal) => (
                      <div key={animal.name} className="bg-lighter-green/30 p-3 rounded-lg">
                        <span className="text-2xl block mb-1">{animal.emoji}</span>
                        <span className="font-semibold text-dark-green text-sm">{animal.name}</span>
                        <span className="text-xs text-text-light block">{animal.intake}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-green/10 to-lighter-green/30 rounded-xl">
                    <h5 className="font-semibold text-dark-green mb-2">Key AI Features</h5>
                    <ul className="text-sm text-text-dark space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-green rounded-full" />
                        Carrying capacity: 0.5-3.0 AU/ha calculated
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-green rounded-full" />
                        Forage quality grading: A, B, C, D
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-green rounded-full" />
                        Species suitability scoring: 0-100%
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary-green rounded-full" />
                        Heat stress risk assessment
                      </li>
                    </ul>
                  </div>
                  <a
                    href="/demo"
                    className="mt-4 block w-full text-center bg-primary-green text-white py-3 rounded-full font-semibold hover:bg-dark-green transition-colors"
                  >
                    Try Livestock Manager
                  </a>
                </div>
              </div>
            )}

            {activeTab === "offline-mode" && (
              <div className="max-w-2xl mx-auto">
                <h3 className="font-heading font-semibold text-2xl text-dark-green mb-4">Works Anywhere, Anytime</h3>
                <p className="text-text-light mb-6">
                  {"PastureAI's on-device AI model works without internet connection—perfect for remote farming areas."}
                </p>
                <ul className="space-y-4">
                  {[
                    "Download model once, use anywhere",
                    "No data plans required",
                    "Instant results even offline",
                    "Syncs when connection available",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-primary-green flex-shrink-0" />
                      <span className="text-text-dark">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "community" && (
              <div className="max-w-3xl mx-auto">
                <h3 className="font-heading font-semibold text-2xl text-dark-green mb-4">Farmer Community Network</h3>
                <p className="text-text-light mb-8">
                  Connect with other farmers, share insights, and learn from collective experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: "🗺️",
                      title: "Regional Maps",
                      description: "View biomass levels in your area",
                    },
                    {
                      icon: "💬",
                      title: "Expert Advice",
                      description: "Get guidance from agricultural experts",
                    },
                    {
                      icon: "🔗",
                      title: "Knowledge Sharing",
                      description: "Share best practices with peers",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="text-center p-6 bg-lighter-green/30 rounded-xl">
                      <div className="text-4xl mb-3">{feature.icon}</div>
                      <h4 className="font-heading font-semibold text-dark-green mb-2">{feature.title}</h4>
                      <p className="text-text-light text-sm">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "sustainability" && <SustainabilityDashboard />}
          </div>
        </div>
      </div>
    </section>
  )
}

function SustainabilityDashboard() {
  const [report, setReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [farmSize, setFarmSize] = useState(100)

  const generateReport = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/sustainability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmSize }),
      })
      const result = await response.json()
      setReport(result.data)
    } catch (error) {
      console.error("Failed to generate report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="font-heading font-semibold text-2xl text-dark-green mb-4">AI Sustainability Dashboard</h3>
      <p className="text-text-light mb-6">Generate personalized sustainability reports powered by AI analysis.</p>

      {/* Farm Size Input */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <label className="block text-text-dark font-medium mb-2">Farm Size (hectares)</label>
        <div className="flex gap-4">
          <input
            type="number"
            value={farmSize}
            onChange={(e) => setFarmSize(Number(e.target.value))}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
            min="1"
          />
          <button
            onClick={generateReport}
            disabled={isLoading}
            className="bg-primary-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-dark-green disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Results */}
      {report && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-primary-green mb-1">
                {report.carbon_metrics.total_sequestered_kg.toFixed(0)}
              </div>
              <div className="text-text-light text-sm">kg CO₂ Sequestered</div>
              <div className="text-xs text-primary-green mt-2">
                ${report.carbon_metrics.carbon_credit_value_usd.toFixed(2)} in carbon credits
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">
                {(report.water_metrics.water_saved_liters / 1000).toFixed(0)}k
              </div>
              <div className="text-text-light text-sm">Liters Water Saved</div>
              <div className="text-xs text-blue-500 mt-2">
                {report.water_metrics.drought_resilience_score}% drought resilience
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-earth-brown mb-1">
                {(report.soil_metrics.health_index * 100).toFixed(0)}%
              </div>
              <div className="text-text-light text-sm">Soil Health Index</div>
              <div className="text-xs text-earth-brown mt-2">
                {report.soil_metrics.erosion_reduction_percent.toFixed(0)}% erosion reduction
              </div>
            </div>
          </div>

          {/* Economic Impact */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="font-heading font-semibold text-dark-green mb-4">Economic Impact</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-green">
                  ${report.economic_impact.feed_cost_savings_monthly.toFixed(0)}
                </div>
                <div className="text-text-light text-sm">Monthly Feed Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-dark-green">
                  +{report.economic_impact.productivity_increase_percent.toFixed(1)}%
                </div>
                <div className="text-text-light text-sm">Productivity Increase</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-green">
                  {report.economic_impact.roi_estimate_percent.toFixed(0)}%
                </div>
                <div className="text-text-light text-sm">Estimated ROI</div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="font-heading font-semibold text-dark-green mb-4">AI Recommendations</h4>
            <ul className="space-y-3">
              {report.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                  <span className="text-text-dark text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Default View */}
      {!report && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: "—", label: "Tons CO₂ Sequestered", color: "text-primary-green" },
            { value: "—", label: "Water Usage Reduced", color: "text-blue-500" },
            { value: "—", label: "Soil Health Improved", color: "text-earth-brown" },
          ].map((metric, i) => (
            <div key={i} className="text-center p-6 bg-lighter-green/30 rounded-xl">
              <div className={`text-4xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
              <p className="text-text-light text-sm">{metric.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
