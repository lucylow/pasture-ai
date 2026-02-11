import { Link } from 'react-router-dom'
import { mockAnalyses } from '../mock/data'

const healthDot: Record<string, string> = {
  excellent: 'bg-green-500',
  good: 'bg-emerald-500',
  fair: 'bg-yellow-500',
  poor: 'bg-red-500',
}

export function MapPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Map</h2>
      <p className="text-sm text-muted-foreground">
        Static representation of paddocks. In a real app this would be an interactive satellite map.
        {' '}
        <Link to="/image2biomass" className="text-primary hover:underline">View Image2Biomass map →</Link>
      </p>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="aspect-[16/9] bg-muted relative grid grid-cols-3 gap-4 p-6">
          {mockAnalyses.map((a, i) => {
            const positions = [
              'top-8 left-10',
              'top-16 right-16',
              'bottom-20 left-1/3',
              'top-1/3 right-1/4',
              'bottom-10 right-10',
            ]
            return (
              <div
                key={a.id}
                className={`absolute ${positions[i] ?? ''} bg-card rounded-lg border border-border shadow-sm p-3 max-w-[180px]`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${healthDot[a.health]}`} />
                  <span className="text-sm font-medium truncate">{a.paddockName}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.biomassKgHa.toLocaleString()} kg/ha · {a.health}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
