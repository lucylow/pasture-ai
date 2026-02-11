'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiPostForm, ApiError } from '@/lib/api';

type Prediction = {
  biomass_gm2: number;
  recommendation: string;
  confidence: number;
  source?: 'backend' | 'mock';
};

function mapBackendResponse(data: {
  predictions?: { Dry_Total_g?: number; GDM_g?: number };
  metrics?: { pasture_health?: string };
  confidence_score?: number;
}): Prediction {
  const biomass =
    data.predictions?.Dry_Total_g ?? data.predictions?.GDM_g ?? 0;
  const health = data.metrics?.pasture_health ?? 'unknown';
  const confidence = data.confidence_score ?? 0.7;

  const recommendation =
    health === 'poor'
      ? 'Rest pasture longer. Consider soil amendments and reseeding.'
      : health === 'fair'
        ? 'Rest 4–6 days, then graze moderately.'
        : 'Safe to graze lightly today with low compaction risk.';

  return {
    biomass_gm2: biomass,
    recommendation,
    confidence,
    source: 'backend',
  };
}

function mockPredictFromImage(file: File): Promise<Prediction> {
  return new Promise((resolve) => {
    const sizeFactor = Math.min(1, file.size / (1024 * 1024));
    const base = 600 + Math.round(sizeFactor * 300);
    const confidence = 0.7 + sizeFactor * 0.2;

    const recommendation =
      base > 800
        ? 'Delay grazing 7–10 days to protect recovery.'
        : base > 650
          ? 'Rest 4–6 days, then graze moderately.'
          : 'Safe to graze lightly today with low compaction risk.';

    setTimeout(() => {
      resolve({
        biomass_gm2: base,
        recommendation,
        confidence,
        source: 'mock',
      });
    }, 600);
  });
}

async function predictFromImage(file: File): Promise<Prediction> {
  try {
    const form = new FormData();
    form.append('file', file, file.name);
    const data = await apiPostForm<Parameters<typeof mapBackendResponse>[0]>(
      '/api/v1/mock/predict',
      form
    );
    return mapBackendResponse(data);
  } catch (err) {
    if (err instanceof ApiError) {
      console.warn('Backend unavailable, falling back to mock:', err.message);
    }
    return mockPredictFromImage(file);
  }
}

const SAMPLES = [
  { id: '1', label: 'Healthy', img: '/healthy-green-pasture-grassland-thumbnail.jpg', full: '/healthy-green-pasture-grassland.jpg' },
  { id: '2', label: 'Overgrazed', img: '/overgrazed-dry-pasture-land-thumbnail.jpg', full: '/overgrazed-dry-pasture-land.jpg' },
  { id: '3', label: 'Optimal', img: '/optimal-lush-green-grass-field-thumbnail.jpg', full: '/optimal-lush-green-grass-field.jpg' },
  { id: '4', label: 'Fair', img: '/fair-condition-pasture-meadow-thumbnail.jpg', full: '/fair-condition-pasture-meadow-aerial-view.jpg' },
];

export default function LiveDemoSection() {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function analyzeImage(file: File) {
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setLoading(true);
    const result = await predictFromImage(file);
    setPrediction(result);
    setLoading(false);
  }

  async function handleSampleClick(sample: (typeof SAMPLES)[0]) {
    setSelectedSample(sample.id);
    setLoading(true);
    setPrediction(null);
    try {
      const res = await fetch(sample.full);
      const blob = await res.blob();
      const file = new File([blob], `sample-${sample.label}.jpg`, { type: 'image/jpeg' });
      setPreviewUrl(sample.full);
      const result = await predictFromImage(file);
      setPrediction(result);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setSelectedSample(null);
      analyzeImage(f);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith('image/')) {
      setSelectedSample(null);
      analyzeImage(f);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  const biomassVal = prediction?.biomass_gm2 ?? '—';
  const daysVal = prediction
    ? prediction.biomass_gm2 > 800
      ? 5
      : prediction.biomass_gm2 > 650
        ? 7
        : 3
    : '—';
  const carbonVal = prediction ? Math.round(prediction.biomass_gm2 * 0.15) : '—';
  const savingsVal = prediction ? Math.round((prediction.biomass_gm2 / 100) * 5) : '—';

  return (
    <section id="live-demo" className="scroll-mt-24">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Try PastureAI Live Demo
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Experience our AI-powered biomass estimation technology in action
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload area */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Upload Pasture Image</h3>
            <p className="text-sm text-slate-500">Drag & drop or click to upload</p>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver ? 'border-pasture-moss bg-pasture-moss-50' : 'border-slate-300 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="demo-upload"
              />
              <label
                htmlFor="demo-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-pasture-moss text-white font-semibold text-sm hover:bg-pasture-moss/90 transition-colors"
              >
                Choose Image
              </label>
              <p className="mt-3 text-xs text-slate-500">
                Upload an image to see AI analysis results
              </p>
            </div>
          </div>

          {/* Quick Analysis samples */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Quick Analysis</h3>
            <div className="flex flex-wrap gap-3">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSampleClick(s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    selectedSample === s.id
                      ? 'border-pasture-moss bg-pasture-moss-50 ring-2 ring-pasture-moss/30'
                      : 'border-slate-200 bg-white hover:border-pasture-meadow/60 hover:bg-pasture-moss-50/50'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image src={s.img} alt={s.label} fill className="object-cover" sizes="48px" />
                  </div>
                  <span className="text-sm font-medium text-slate-800">Sample {s.id} - {s.label}</span>
                </button>
              ))}
            </div>

            {/* Analysis Results */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Analysis Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Biomass Estimate</h4>
                  {loading ? (
                    <div className="mt-1 h-8 w-24 rounded bg-slate-200 animate-pulse" />
                  ) : (
                    <p className="text-xl font-semibold text-pasture-moss mt-1">
                      {typeof biomassVal === 'number' ? `${biomassVal} g/m²` : biomassVal}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Grazing Schedule</h4>
                  {loading ? (
                    <div className="mt-1 h-8 w-20 rounded bg-slate-200 animate-pulse" />
                  ) : (
                    <p className="text-xl font-semibold text-slate-800 mt-1">
                      {typeof daysVal === 'number' ? `${daysVal} days` : daysVal}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Carbon Impact</h4>
                  {loading ? (
                    <div className="mt-1 h-8 w-16 rounded bg-slate-200 animate-pulse" />
                  ) : (
                    <p className="text-xl font-semibold text-slate-800 mt-1">
                      {typeof carbonVal === 'number' ? `${carbonVal} kg` : carbonVal}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">Feed Savings</h4>
                  {loading ? (
                    <div className="mt-1 h-8 w-16 rounded bg-slate-200 animate-pulse" />
                  ) : (
                    <p className="text-xl font-semibold text-slate-800 mt-1">
                      {typeof savingsVal === 'number' ? `$${savingsVal}` : savingsVal}
                    </p>
                  )}
                </div>
              </div>
              {prediction && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-700">{prediction.recommendation}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Confidence: {(prediction.confidence * 100).toFixed(0)}% ·{' '}
                    {prediction.source === 'backend' ? 'Backend model' : 'Mock (backend offline)'}
                  </p>
                </div>
              )}
              {!previewUrl && !loading && (
                <p className="text-sm text-slate-500 mt-4">Run analysis to see results</p>
              )}
            </div>
          </div>
        </div>

        {previewUrl && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 overflow-hidden">
            <p className="text-xs font-semibold text-slate-600 mb-3">Preview</p>
            <div className="relative aspect-video max-h-64 rounded-lg overflow-hidden bg-slate-100">
              {previewUrl.startsWith('blob:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Pasture preview" className="w-full h-full object-cover" />
              ) : (
                <Image src={previewUrl} alt="Pasture preview" fill className="object-cover" />
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-pasture-moss text-white font-semibold hover:bg-pasture-moss/90 transition-colors"
          >
            Try the Demo App
          </Link>
          <Link
            href="/cooperative"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-pasture-moss text-pasture-moss font-semibold hover:bg-pasture-moss/5 transition-colors"
          >
            View Cooperative Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
