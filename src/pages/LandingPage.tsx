import { Link } from 'react-router-dom'
import {
  Leaf, ChevronDown, AlertTriangle, DollarSign, Clock, Wifi,
  Upload, Camera, BarChart3, Users, TreePine, Smartphone,
  Shield, Zap, Globe, Server, Code, Brain, Sprout, Droplets,
  Bug, Wind, Pause, BookOpen, ArrowRight
} from 'lucide-react'
import { useState } from 'react'

const problemCards = [
  {
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    title: 'Overgrazing & Land Degradation',
    desc: 'Inaccurate estimates lead to overgrazing, causing soil erosion and reduced long-term pasture productivity.',
  },
  {
    icon: <DollarSign className="w-6 h-6 text-amber-500" />,
    title: 'Increased Feed Costs',
    desc: 'Underestimating biomass forces farmers to purchase expensive supplemental feed unnecessarily.',
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-500" />,
    title: 'Labor-Intensive Methods',
    desc: 'Traditional "clip and weigh" methods take hours per pasture and don\'t scale for larger operations.',
  },
  {
    icon: <Wifi className="w-6 h-6 text-purple-500" />,
    title: 'Limited Technology Access',
    desc: 'Advanced solutions like satellite imaging are expensive and require technical expertise beyond most farmers.',
  },
]

const sampleImages = [
  { label: 'Sample 1 - Healthy', src: '/healthy-green-pasture-grassland-thumbnail.jpg' },
  { label: 'Sample 2 - Overgrazed', src: '/overgrazed-dry-pasture-land-thumbnail.jpg' },
  { label: 'Sample 3 - Optimal', src: '/optimal-lush-green-grass-field-thumbnail.jpg' },
  { label: 'Sample 4 - Fair', src: '/fair-condition-pasture-meadow-thumbnail.jpg' },
]

const ecoTips = [
  { icon: <Sprout className="w-5 h-5" />, title: 'Implement Rotational Grazing', desc: 'Divide your pasture into smaller paddocks and rotate livestock regularly. This allows grass to recover, prevents overgrazing, and improves soil health.', season: 'Year-round', difficulty: 'Moderate' },
  { icon: <Droplets className="w-5 h-5" />, title: 'Optimize Water Distribution', desc: 'Strategic placement of water sources encourages even grazing distribution and prevents congregation areas.', season: 'Year-round', difficulty: 'Moderate' },
  { icon: <BookOpen className="w-5 h-5" />, title: 'Regular Soil Testing & Amendment', desc: 'Test soil annually to understand nutrient levels and pH. Targeted amendments are more cost-effective.', season: 'Fall', difficulty: 'Easy' },
  { icon: <TreePine className="w-5 h-5" />, title: 'Plant Diverse Grass & Legume Mix', desc: 'Multi-species pastures are more resilient to drought, disease, and pests. Legumes fix nitrogen naturally.', season: 'Spring', difficulty: 'Moderate' },
  { icon: <Wind className="w-5 h-5" />, title: 'Establish Shelter Belts & Trees', desc: 'Strategic tree planting provides windbreaks, shade for livestock, wildlife habitat, and carbon sequestration.', season: 'Spring', difficulty: 'Advanced' },
  { icon: <Bug className="w-5 h-5" />, title: 'Support Beneficial Insects', desc: 'Pollinators and pest predators improve pasture ecosystem health. Creating habitat reduces pest pressure naturally.', season: 'Spring', difficulty: 'Easy' },
  { icon: <Pause className="w-5 h-5" />, title: 'Implement Strategic Rest Periods', desc: 'Allowing pastures adequate rest enables full root recovery, builds soil organic matter, and increases productivity.', season: 'Year-round', difficulty: 'Easy' },
  { icon: <Leaf className="w-5 h-5" />, title: 'Use Cover Crops & Green Manure', desc: 'Planting cover crops during fallow periods prevents erosion, adds organic matter, and improves soil health.', season: 'Fall', difficulty: 'Moderate' },
]

const techCards = [
  { emoji: '🐍', title: 'AI Model', desc: "Based on CSIRO's Image2Biomass research using SigLIP/DINOv2 embeddings", tags: ['Computer Vision', 'Transfer Learning', 'On-device Inference'] },
  { emoji: '⚛️', title: 'Frontend', desc: 'React for cross-platform app with offline capabilities', tags: ['Progressive Web App', 'TensorFlow.js', 'Real-time Analytics'] },
  { emoji: '🖥️', title: 'Backend', desc: 'Scalable cloud API for community features and data synchronization', tags: ['Cloud Integration', 'Secure Authentication', 'Data Analytics'] },
]

const techFeatures = [
  { icon: <Wifi className="w-5 h-5" />, title: 'Offline-First Architecture', desc: 'Full functionality without internet connectivity, syncing when available' },
  { icon: <Globe className="w-5 h-5" />, title: 'Multi-Platform Support', desc: 'Available on iOS, Android, and web browsers for maximum accessibility' },
  { icon: <Zap className="w-5 h-5" />, title: 'Real-Time Processing', desc: 'On-device AI inference for instant biomass predictions without server delays' },
  { icon: <Shield className="w-5 h-5" />, title: 'Enterprise Security', desc: 'End-to-end encryption and secure data handling for farm data protection' },
]

export function LandingPage() {
  const [selectedSample, setSelectedSample] = useState(0)
  const [analyzed, setAnalyzed] = useState(false)

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(90,30%,95%)] via-[hsl(90,20%,96%)] to-[hsl(120,15%,94%)] py-20 lg:py-28">
        <div className="absolute top-10 left-10 w-40 h-40 bg-[hsl(var(--primary))] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-[hsl(var(--primary))] opacity-5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[hsl(var(--foreground))]">
              Real-Time Biomass Estimation for Sustainable Grazing
            </h1>
            <p className="mt-6 text-lg text-[hsl(var(--muted-foreground))] max-w-lg">
              PastureAI uses smartphone images and AI to help farmers optimize grazing, increase productivity, and promote sustainable land management—all in real-time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--primary))] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <Smartphone className="w-4 h-4" /> Try Demo App
              </Link>
              <a
                href="#app-demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] font-semibold hover:bg-[hsl(var(--primary))]/5 transition-colors"
              >
                ▶ Watch Demo
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-sm font-medium">
              <Leaf className="w-4 h-4" /> Trusted by farmers worldwide for sustainable agriculture
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[hsl(var(--border))] bg-white">
              <img
                src="/healthy-green-pasture-grassland-farm.jpg"
                alt="Farmer using PastureAI app in field"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <a href="#problem" className="inline-flex flex-col items-center text-[hsl(var(--primary))] text-sm hover:opacity-70 transition-opacity">
            Scroll to explore
            <ChevronDown className="w-5 h-5 mt-1 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Sustainability banner */}
      <section className="bg-[hsl(var(--primary))] text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Supporting Sustainable Agriculture & Farmer Communities</h3>
          <p className="text-sm text-white/80">
            PastureAI addresses real-world sustainability challenges while empowering farmers with accessible technology.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-2">The Problem We're Solving</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))]">
              Farmers Struggle to Estimate Pasture Biomass Accurately
            </h2>
            <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
              Current methods are either inaccurate, time-consuming, or inaccessible to small and medium-sized farms.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problemCards.map((card, i) => (
              <div key={i} className="bg-[hsl(var(--background))] rounded-xl p-6 border border-[hsl(var(--border))] hover:shadow-lg transition-shadow">
                <div className="mb-4">{card.icon}</div>
                <h4 className="font-semibold text-[hsl(var(--foreground))] mb-2">{card.title}</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="py-20 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-2">Our AI-Powered Solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))]">
              Harnessing CSIRO's Image2Biomass Research
            </h2>
            <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
              Advanced AI for accessible farming technology
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-[hsl(var(--border))] p-8 shadow-sm">
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {['Image Analysis', 'Livestock AI', 'Offline Mode', 'Community', 'Sustainability'].map(tab => (
                <span key={tab} className="px-4 py-2 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-sm font-medium">
                  {tab}
                </span>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-[hsl(var(--primary))] transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-[hsl(var(--muted-foreground))] mb-4" />
                <p className="font-semibold text-[hsl(var(--foreground))]">Upload Pasture Image</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Drag & drop or click to upload</p>
                <button className="mt-4 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Choose Image
                </button>
              </div>
              <div className="bg-[hsl(var(--background))] rounded-xl p-6">
                <p className="text-sm text-[hsl(var(--muted-foreground))] text-center">Upload an image to see AI analysis results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="app-demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-2">Try PastureAI Live Demo</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))]">
              Experience our AI-powered biomass estimation
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[hsl(var(--background))] rounded-2xl border border-[hsl(var(--border))] p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Analysis</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedSample(i); setAnalyzed(false) }}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${selectedSample === i ? 'border-[hsl(var(--primary))] shadow-md' : 'border-transparent'}`}
                  >
                    <img src={img.src} alt={img.label} className="w-full h-24 object-cover" />
                    <p className="text-xs p-1 text-center truncate">{img.label}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setAnalyzed(true)}
                className="w-full py-3 rounded-lg bg-[hsl(var(--primary))] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Analyze with AI
              </button>
            </div>
            <div className="bg-[hsl(var(--background))] rounded-2xl border border-[hsl(var(--border))] p-6">
              <h3 className="font-semibold text-lg mb-4">Analysis Results</h3>
              <div className="grid grid-cols-2 gap-4">
                <ResultCard label="Biomass Estimate" value={analyzed ? '2,450 g/m²' : '— g/m²'} sub={analyzed ? 'High density' : 'Run analysis to see'} />
                <ResultCard label="Grazing Schedule" value={analyzed ? '14 days' : '— days'} sub="Recommended duration" />
                <ResultCard label="Carbon Impact" value={analyzed ? '3.2 kg' : '— kg'} sub="Annual sequestration" />
                <ResultCard label="Feed Savings" value={analyzed ? '$340' : '$—'} sub="Monthly savings potential" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ECO TIPS */}
      <section id="eco-tips" className="py-20 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-2">Farmer Resources</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))]">Ecological Transformation Tips</h2>
            <p className="mt-4 text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
              Practical, science-backed strategies to improve your pasture health, increase productivity, and build a more sustainable farming operation.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatHighlight value="30-50%" label="Productivity increase with rotational grazing" />
            <StatHighlight value="200 lbs" label="Nitrogen fixed per acre by legumes annually" />
            <StatHighlight value="5 tons" label="CO2 sequestered per acre with silvopasture" />
            <StatHighlight value="6 feet" label="Deep root growth with proper rest periods" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecoTips.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-[hsl(var(--border))] p-5 hover:shadow-lg transition-shadow">
                <div className="flex gap-2 mb-3 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">{tip.season}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]">{tip.difficulty}</span>
                </div>
                <h4 className="font-semibold text-sm text-[hsl(var(--foreground))] mb-2">{tip.title}</h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-[hsl(var(--primary))] rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Ready to Transform Your Pastures?</h3>
            <p className="text-sm text-white/80 mb-6">Use PastureAI to monitor your progress and get personalized recommendations.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/dashboard" className="px-5 py-2.5 rounded-full bg-white text-[hsl(var(--primary))] font-semibold text-sm hover:opacity-90 transition-opacity">
                Try the Demo App
              </Link>
              <a href="#solution" className="px-5 py-2.5 rounded-full border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Analyze Your Pasture
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL */}
      <section id="technical" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[hsl(var(--primary))] uppercase tracking-widest mb-2">Technical Implementation</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))]">
              Built with cutting-edge technology
            </h2>
            <p className="mt-4 text-[hsl(var(--muted-foreground))]">For reliability and performance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {techCards.map((card, i) => (
              <div key={i} className="bg-[hsl(var(--background))] rounded-xl border border-[hsl(var(--border))] p-6 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h4 className="font-bold text-lg text-[hsl(var(--foreground))] mb-2">{card.title}</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">{card.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded text-xs bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techFeatures.map((f, i) => (
              <div key={i} className="bg-[hsl(var(--background))] rounded-xl border border-[hsl(var(--border))] p-5">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] mb-3">
                  {f.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 bg-gradient-to-br from-[hsl(120,27%,33%)] to-[hsl(120,20%,20%)] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your Pasture Management?</h2>
          <p className="text-lg text-white/80 mb-8">
            Join thousands of farmers using AI-powered insights to optimize grazing, improve livestock health, and build sustainable agricultural practices.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[hsl(var(--primary))] font-semibold hover:opacity-90 transition-opacity">
              <Smartphone className="w-4 h-4" /> Try Demo App
            </Link>
            <a href="https://github.com/lucylow/pasture-ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors">
              <Code className="w-4 h-4" /> View Source
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function ResultCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-xl border border-[hsl(var(--border))] p-4 text-center">
      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{label}</p>
      <p className="text-xl font-bold text-[hsl(var(--foreground))]">{value}</p>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{sub}</p>
    </div>
  )
}

function StatHighlight({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[hsl(var(--primary))]/5 rounded-xl p-4 text-center border border-[hsl(var(--primary))]/10">
      <p className="text-2xl font-bold text-[hsl(var(--primary))]">{value}</p>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{label}</p>
    </div>
  )
}
