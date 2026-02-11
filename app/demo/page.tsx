'use client';

import { mockFarmsForDemo } from '@/data/mock/farm1';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-3 bg-white rounded-lg border text-center">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-bold mt-1 truncate">{value}</div>
    </div>
  );
}

function DemoContent() {
  const searchParams = useSearchParams();
  const farmId = searchParams.get('farm') || 'f1';
  const farm = mockFarmsForDemo.find((f) => f.id === farmId) || mockFarmsForDemo[0];
  const tile = farm.latestTile;
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Demo — Farm snapshot</h1>
          <div className="flex gap-2 flex-wrap">
            {mockFarmsForDemo.map((f) => (
              <Link
                key={f.id}
                href={`/demo?farm=${f.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  farm.id === f.id ? 'bg-pasture-moss text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <div className="w-full lg:w-2/3">
                <div className="h-72 bg-slate-100 rounded-lg overflow-hidden relative">
                  <Image
                    src={tile.image}
                    alt="mock tile"
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <Metric title="Biomass" value={`${tile.biomass} g/m²`} />
                  <Metric title="CI (95%)" value={`${tile.ciLow} → ${tile.ciHigh} g/m²`} />
                  <Metric title="Recommendation" value={tile.recommendation} />
                </div>
              </div>

              <div className="w-full lg:w-1/3">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Per-tile outputs</h3>
                  <pre className="text-xs mt-3 p-3 bg-white rounded border text-slate-600 overflow-auto max-h-48">
                    {JSON.stringify(tile.outputs, null, 2)}
                  </pre>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="text-sm text-slate-500">Export</div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button type="button" className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200">GeoTIFF</button>
                    <button type="button" className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200">CSV</button>
                    <button type="button" className="px-3 py-2 bg-slate-100 rounded hover:bg-slate-200">JSON</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-semibold mb-2 text-slate-900">Farm details</h3>
            <div className="text-sm text-slate-600">Name: {farm.name}</div>
            <div className="text-sm text-slate-600">Region: {farm.region}</div>
            <div className="text-sm text-slate-600">Area: {farm.area} ha</div>

            <div className="mt-4">
              <h4 className="font-semibold text-slate-900">Model metrics</h4>
              <div className="mt-2 text-sm text-slate-600">RMSE ≈ 0.3 t/ha</div>
              <div className="text-sm text-slate-600">Validation: n = 120 sites</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12 text-slate-500">Loading...</div>}>
      <DemoContent />
    </Suspense>
  );
}
