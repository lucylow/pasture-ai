import { mockAnalyses } from '../mock/data'

const colors: Record<string, string> = {
  excellent: 'bg-green-200 border-green-400',
  good: 'bg-emerald-100 border-emerald-300',
  fair: 'bg-yellow-100 border-yellow-300',
  poor: 'bg-red-100 border-red-300',
}

export function MapPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Map (mock)</h2>
      <p className="text-gray-500 text-sm">Static representation of paddocks. In a real app this would be interactive.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockAnalyses.map(a => (
          <div key={a.id} className={`rounded-xl border-2 p-6 ${colors[a.health]}`}>
            <h3 className="font-semibold text-lg">{a.paddockName}</h3>
            <p className="text-sm text-gray-700">{a.biomassKgHa} kg/ha • {a.health}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
