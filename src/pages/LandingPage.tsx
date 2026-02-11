import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-16">
        <h2 className="text-4xl font-bold mb-4">PastureAI</h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
          A mock multi-page frontend showing how a real-time biomass estimation app for farmers could look.
        </p>
        <ul className="text-sm text-gray-500 space-y-1 mb-8">
          <li>• Landing page with marketing copy</li>
          <li>• Dashboard with mock biomass stats</li>
          <li>• Map view with fake paddock locations</li>
          <li>• Community feed with farmer posts</li>
        </ul>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard" className="px-5 py-2 rounded-lg bg-[hsl(142,40%,33%)] text-white font-medium hover:opacity-90">
            View mock dashboard
          </Link>
          <Link to="/community" className="px-5 py-2 rounded-lg border border-gray-300 font-medium hover:bg-gray-50">
            Open community
          </Link>
        </div>
      </section>
      <section className="bg-white rounded-xl border p-8">
        <h3 className="text-lg font-semibold mb-4">Mock snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Avg biomass" value="2050 kg/ha" />
          <Stat label="Healthy paddocks" value="68%" />
          <Stat label="Regions" value="3" />
          <Stat label="Pilot farms" value="5" />
        </div>
        <p className="text-xs text-gray-400 mt-4">All values on this site are mocked for UI demonstration only.</p>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
