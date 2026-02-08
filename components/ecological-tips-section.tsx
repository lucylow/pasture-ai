"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Leaf,
  Droplets,
  Sun,
  Wind,
  Bug,
  TreeDeciduous,
  Sprout,
  Mountain,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Calendar,
  CheckCircle2,
} from "lucide-react"

interface Tip {
  id: string
  title: string
  description: string
  benefits: string[]
  implementation: string[]
  season: "spring" | "summer" | "fall" | "winter" | "all"
  difficulty: "easy" | "moderate" | "advanced"
  icon: typeof Leaf
}

const ecologicalTips: Tip[] = [
  {
    id: "rotational-grazing",
    title: "Implement Rotational Grazing",
    description:
      "Divide your pasture into smaller paddocks and rotate livestock regularly. This allows grass to recover, prevents overgrazing, and improves soil health through even manure distribution.",
    benefits: [
      "Increases pasture productivity by 30-50%",
      "Improves soil organic matter",
      "Reduces parasite loads in livestock",
      "Enhances biodiversity",
    ],
    implementation: [
      "Divide pastures into 4-8 paddocks",
      "Graze each paddock for 1-7 days",
      "Allow 21-60 days rest between grazing cycles",
      "Monitor grass height - move when grazed to 3-4 inches",
    ],
    season: "all",
    difficulty: "moderate",
    icon: Leaf,
  },
  {
    id: "water-management",
    title: "Optimize Water Distribution",
    description:
      "Strategic placement of water sources encourages even grazing distribution and prevents congregation areas that lead to soil compaction and bare patches.",
    benefits: [
      "Reduces soil compaction",
      "Prevents erosion near water sources",
      "Improves grazing uniformity",
      "Enhances pasture utilization",
    ],
    implementation: [
      "Install multiple water points across pastures",
      "Use portable tanks for rotational systems",
      "Create gravel pads around permanent water sources",
      "Consider gravity-fed systems to reduce costs",
    ],
    season: "all",
    difficulty: "moderate",
    icon: Droplets,
  },
  {
    id: "soil-testing",
    title: "Regular Soil Testing & Amendment",
    description:
      "Test soil annually to understand nutrient levels and pH. Targeted amendments based on test results are more cost-effective and environmentally friendly than blanket applications.",
    benefits: [
      "Optimizes fertilizer spending",
      "Prevents nutrient runoff",
      "Improves grass growth and quality",
      "Supports beneficial soil biology",
    ],
    implementation: [
      "Test soil every 1-3 years in each pasture zone",
      "Apply lime to correct pH (target 6.0-7.0 for most grasses)",
      "Use organic matter to improve soil structure",
      "Consider compost applications over synthetic fertilizers",
    ],
    season: "fall",
    difficulty: "easy",
    icon: Mountain,
  },
  {
    id: "diverse-species",
    title: "Plant Diverse Grass & Legume Mix",
    description:
      "Multi-species pastures are more resilient to drought, disease, and pests. Legumes fix nitrogen naturally, reducing fertilizer needs while improving forage quality.",
    benefits: [
      "Natural nitrogen fixation (50-200 lbs N/acre/year)",
      "Extended grazing season",
      "Improved drought tolerance",
      "Better nutritional profile for livestock",
    ],
    implementation: [
      "Include 30-40% legumes (clover, alfalfa, trefoil)",
      "Mix cool and warm-season grasses",
      "Overseed thin areas in early spring or fall",
      "Consider native grass species for resilience",
    ],
    season: "spring",
    difficulty: "moderate",
    icon: Sprout,
  },
  {
    id: "shelter-belts",
    title: "Establish Shelter Belts & Trees",
    description:
      "Strategic tree planting provides windbreaks, shade for livestock, wildlife habitat, and carbon sequestration while reducing erosion and improving water retention.",
    benefits: [
      "Reduces livestock heat stress by 20-30%",
      "Sequesters 2-5 tons CO2/acre/year",
      "Creates beneficial insect habitat",
      "Reduces wind erosion and evaporation",
    ],
    implementation: [
      "Plant trees on north and west boundaries for wind protection",
      "Include fruit/nut trees for additional income",
      "Use fast-growing willows or poplars for quick results",
      "Protect young trees from livestock damage",
    ],
    season: "spring",
    difficulty: "advanced",
    icon: TreeDeciduous,
  },
  {
    id: "beneficial-insects",
    title: "Support Beneficial Insects",
    description:
      "Pollinators and pest predators improve pasture ecosystem health. Creating habitat for beneficial insects reduces pest pressure naturally and supports biodiversity.",
    benefits: [
      "Natural pest control",
      "Improved pollination for legumes",
      "Enhanced biodiversity",
      "Reduced pesticide costs",
    ],
    implementation: [
      "Leave unmowed buffer strips (10-20 ft wide)",
      "Plant wildflower strips along fence lines",
      "Reduce or eliminate broad-spectrum pesticides",
      "Install insect hotels and nesting sites",
    ],
    season: "spring",
    difficulty: "easy",
    icon: Bug,
  },
  {
    id: "rest-periods",
    title: "Implement Strategic Rest Periods",
    description:
      "Allowing pastures adequate rest between grazing events enables full root recovery, builds soil organic matter, and dramatically increases long-term productivity.",
    benefits: [
      "Deeper root systems (up to 6 feet)",
      "Increased drought tolerance",
      "Higher biomass production",
      "Improved carbon sequestration",
    ],
    implementation: [
      "Rest pastures for 30-90 days depending on season",
      "Longer rest in drought conditions",
      "Monitor plant recovery before re-grazing",
      "Use sacrifice paddocks during wet periods",
    ],
    season: "all",
    difficulty: "easy",
    icon: Sun,
  },
  {
    id: "cover-crops",
    title: "Use Cover Crops & Green Manure",
    description:
      "Planting cover crops during fallow periods prevents erosion, adds organic matter, and can provide additional grazing while improving soil health for the next growing season.",
    benefits: [
      "Prevents soil erosion",
      "Adds nitrogen (legume covers)",
      "Improves soil structure",
      "Suppresses weeds naturally",
    ],
    implementation: [
      "Plant winter rye or oats after summer grazing",
      "Use crimson clover for nitrogen fixation",
      "Terminate covers before seeding permanent pasture",
      "Consider multi-species cover crop mixes",
    ],
    season: "fall",
    difficulty: "moderate",
    icon: Wind,
  },
]

const seasonColors = {
  spring: "bg-emerald-100 text-emerald-700",
  summer: "bg-amber-100 text-amber-700",
  fall: "bg-orange-100 text-orange-700",
  winter: "bg-blue-100 text-blue-700",
  all: "bg-slate-100 text-slate-700",
}

const difficultyColors = {
  easy: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
}

function TipCard({ tip, isExpanded, onToggle }: { tip: Tip; isExpanded: boolean; onToggle: () => void }) {
  const Icon = tip.icon

  return (
    <motion.div
      layout
      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <button onClick={onToggle} className="w-full text-left p-5 flex items-start gap-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${seasonColors[tip.season]}`}>
              {tip.season === "all" ? "Year-round" : tip.season.charAt(0).toUpperCase() + tip.season.slice(1)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[tip.difficulty]}`}>
              {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900 text-lg mb-1">{tip.title}</h3>
          <p className="text-slate-600 text-sm line-clamp-2">{tip.description}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-slate-100">
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="font-medium text-emerald-700 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Key Benefits
                  </h4>
                  <ul className="space-y-2">
                    {tip.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    How to Implement
                  </h4>
                  <ol className="space-y-2">
                    {tip.implementation.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function EcologicalTipsSection() {
  const [expandedTip, setExpandedTip] = useState<string | null>(null)
  const [filterSeason, setFilterSeason] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")

  const filteredTips = ecologicalTips.filter((tip) => {
    if (filterSeason !== "all" && tip.season !== filterSeason && tip.season !== "all") return false
    if (filterDifficulty !== "all" && tip.difficulty !== filterDifficulty) return false
    return true
  })

  return (
    <section id="tips" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Farmer Resources
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">
            Ecological Transformation Tips
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Practical, science-backed strategies to improve your pasture health, increase productivity, and build a more
            sustainable farming operation.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Season:</span>
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Difficulty:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">30-50%</p>
            <p className="text-sm text-slate-600">Productivity increase with rotational grazing</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">200 lbs</p>
            <p className="text-sm text-slate-600">Nitrogen fixed per acre by legumes annually</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">5 tons</p>
            <p className="text-sm text-slate-600">CO2 sequestered per acre with silvopasture</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">6 feet</p>
            <p className="text-sm text-slate-600">Deep root growth with proper rest periods</p>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid gap-4 max-w-4xl mx-auto">
          {filteredTips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              isExpanded={expandedTip === tip.id}
              onToggle={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
            />
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tips match your current filters. Try adjusting the season or difficulty.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-emerald-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Ready to Transform Your Pastures?</h3>
          <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
            Use PastureAI to monitor your progress and get personalized recommendations based on your specific pasture
            conditions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/demo"
              className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Try the Demo App
            </a>
            <a
              href="#solution"
              className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-400 transition-colors border border-emerald-400"
            >
              Analyze Your Pasture
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
