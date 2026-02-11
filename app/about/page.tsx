import Link from 'next/link';

export default function About() {
  return (
    <section className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">About PastureAI</h1>
        <p className="text-slate-600 mt-2">Real-time biomass estimation for sustainable grazing</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600 leading-relaxed">
          PastureAI is an end-to-end AI platform that turns pasture imagery (phone, drone, satellite) into actionable
          insights for farmers, researchers, and land managers. This demo frontend showcases a multi-page application
          with local mock data, ready for Lovable deployment.
        </p>
        <p className="text-slate-600 leading-relaxed mt-4">
          The platform includes demo tiles, cooperative aggregation, KPI dashboards, community insights, and a
          biomass estimation demo. Farmers can upload images, track paddock health, and coordinate with regional co-ops.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Features</h3>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li>• Image upload + deterministic mock biomass predictor</li>
            <li>• Paddock-level tracking with rest recommendations</li>
            <li>• Cooperative dashboard with spatial biomass aggregation</li>
            <li>• Community feed with peer insights and goals</li>
            <li>• KPI metrics and export (GeoTIFF, CSV, JSON)</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Team (mock)</h3>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li><strong>Remote sensing:</strong> Dr. A. Field</li>
            <li><strong>ML Engineering:</strong> R. Node</li>
            <li><strong>Field Ops:</strong> J. Farmer</li>
            <li><strong>Product:</strong> M. Lovable</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link href="/demo" className="px-6 py-3 bg-pasture-moss text-white rounded-xl font-semibold hover:bg-pasture-moss/90 transition-colors">
          Try Demo
        </Link>
        <Link href="/cooperative" className="px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-pasture-moss hover:text-pasture-moss transition-colors">
          View Cooperative
        </Link>
      </div>
    </section>
  );
}
