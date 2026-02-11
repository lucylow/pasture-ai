'use client';

import { useState } from 'react';
import { postBiomassPredict } from '@/lib/biomassApi';
import { useLocalHistory } from '@/hooks/useLocalHistory';
import { useLang } from '@/hooks/useLang';
import { t } from '@/lib/i18n';

export default function PastureAIDemo() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ dryBiomass_gm2: number; recommendation: string; confidence: number } | null>(null);
  const { items, addItem } = useLocalHistory();
  const { lang, change } = useLang();

  async function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = ((reader.result as string) || '').split(',')[1] || '';
      setImageData(reader.result as string);
      setLoading(true);
      try {
        const res = await postBiomassPredict(base64, { filename: file.name });
        setResult(res);
        addItem({
          id: `${Date.now()}`,
          createdAt: new Date().toISOString(),
          biomass_gm2: res.dryBiomass_gm2,
          recommendation: res.recommendation,
        });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid md:grid-cols-[280px,1fr] gap-6">
      <aside className="border rounded-xl p-4 flex flex-col gap-4 dark:border-slate-700">
        <div>
          <div className="text-sm font-semibold mb-2">Language</div>
          <div className="flex gap-2">
            {(['en', 'es', 'hi'] as const).map((code) => (
              <button
                key={code}
                onClick={() => change(code)}
                className={`px-2 py-1 rounded text-xs ${
                  lang === code ? 'bg-pasture-moss text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold mb-2">{t(lang, 'captureImage')}</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        <div className="text-xs text-slate-500">
          Offline friendly: last {items.length} predictions stay on this device.
        </div>
      </aside>

      <main className="space-y-4">
        <div className="border rounded-xl p-4 flex flex-col md:flex-row gap-4 dark:border-slate-700">
          {imageData ? (
            <img
              src={imageData}
              alt="preview"
              className="w-full md:w-64 rounded-md object-cover"
            />
          ) : (
            <div className="w-full md:w-64 h-40 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center text-xs text-slate-500">
              Drop or choose a pasture photo
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm font-semibold mb-1">{t(lang, 'aiAnalysis')}</div>
            {loading && <div className="text-sm text-slate-500">Analyzing…</div>}
            {!loading && result && (
              <div className="space-y-1 text-sm">
                <div>
                  Biomass: <span className="font-semibold">{result.dryBiomass_gm2} g/m²</span>
                </div>
                <div>Recommendation: {result.recommendation}</div>
                <div>Confidence: {(result.confidence * 100).toFixed(0)}%</div>
              </div>
            )}
          </div>
        </div>

        <section className="border rounded-xl p-4 dark:border-slate-700">
          <div className="text-sm font-semibold mb-2">Recent predictions (offline)</div>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between border-b last:border-0 py-1">
                <span>
                  {new Date(it.createdAt).toLocaleString()} — {it.biomass_gm2} g/m²
                </span>
                <span className="text-slate-400 truncate max-w-[200px]">{it.recommendation}</span>
              </li>
            ))}
            {items.length === 0 && <li>No history yet.</li>}
          </ul>
        </section>
      </main>
    </div>
  );
}
