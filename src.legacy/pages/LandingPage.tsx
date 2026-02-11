import { Link } from 'react-router-dom'

const stats = [
  { label: 'Avg biomass', value: '2,050 kg/ha' },
  { label: 'Healthy paddocks', value: '68%' },
  { label: 'Regions', value: '3' },
  { label: 'Pilot farms', value: '5' },
]

export function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Pasture<span className="text-primary">AI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A mock multi-page frontend showing how a real-time biomass estimation app for farmers could look.
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Landing page with marketing copy</li>
          <li>• Dashboard with mock biomass stats</li>
          <li>• Map view with fake paddock locations</li>
          <li>• Community feed with farmer posts</li>
        </ul>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            View mock dashboard
          </Link>
          <Link
            to="/community"
            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            Open community
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Mock snapshot
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          All values on this site are mocked for UI demonstration only.
        </p>
      </section>
    </div>
  )
}
