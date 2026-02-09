import { useBiomass, useBiomassPredict } from './hooks/useBiomass'
import PastureMap from './components/PastureMap'
import { UploadDropzone } from './components/UploadDropzone'
import { motion } from 'framer-motion'
import { useLovableAuth } from './hooks/useAuth'
import { lovable } from './lib/lovable'

export default function App() {
  const { user, signIn } = useLovableAuth()
  const { data: biomassData, isLoading } = useBiomass(user?.id)
  const predictMutation = useBiomassPredict()
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pasture-moss to-pasture-meadow flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl max-w-md w-full mx-4"
        >
          <h1 className="text-4xl font-bold text-pasture-moss mb-8 text-center">
            🌾 PastureAI
          </h1>
          <button 
            onClick={() => signIn('demo@farm.com', 'pasture123')}
            className="w-full bg-pasture-moss text-white py-3 px-6 rounded-2xl font-semibold hover:bg-pasture-meadow transition-all duration-300"
          >
            Demo Login
          </button>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pasture-soil via-pasture-meadow to-pasture-moss">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-pasture-moss">PastureAI</h1>
            <div className="flex gap-4 text-sm">
              <span>{user.farm_name || 'Demo Farm'}</span>
              <button onClick={() => lovable.auth.signOut()}>Logout</button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <UploadDropzone onPredict={predictMutation.mutate} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <PastureMap analyses={biomassData?.analyses || []} />
          </motion.div>
        </div>
        
        {biomassData?.analyses?.[0] && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 grid md:grid-cols-4 gap-6"
          >
            <KPICard 
              title="Total Biomass" 
              value={`${biomassData.analyses[0].predictions.drytotalg}g/m²`}
              trend="+12%"
              color="green"
            />
            <KPICard 
              title="Pasture Health" 
              value={biomassData.analyses[0].pasture_health}
              trend="+18%"
              color="emerald"
            />
            <KPICard 
              title="Grazing Ready" 
              value={biomassData.analyses[0].recommendations.action}
              trend="Optimal"
              color="blue"
            />
            <KPICard 
              title="Confidence" 
              value={`${(biomassData.analyses[0].confidence * 100).toFixed(0)}%`}
              trend="Stable"
              color="purple"
            />
          </motion.div>
        )}
      </main>
    </div>
  )
}

function KPICard({ title, value, trend, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50">
      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-pasture-moss mt-2">{value}</p>
      <p className="text-sm text-emerald-600 mt-2 font-semibold">{trend}</p>
    </div>
  )
}
