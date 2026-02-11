'use client';

import { useEffect, useState } from 'react';

interface HealthResponse {
  ok?: boolean;
  timestamp?: string;
}

export function HealthStatus() {
  const [status, setStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const isHealthy = status?.ok === true;

  return (
    <section className="card-interactive space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl text-pasture-moss">System Health</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            loading
              ? 'bg-slate-200 text-slate-600'
              : isHealthy
                ? 'bg-pasture-moss-100 text-pasture-moss'
                : 'bg-red-100 text-red-700'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              loading ? 'animate-pulse bg-slate-400' : isHealthy ? 'bg-pasture-moss' : 'bg-red-500'
            }`}
          />
          {loading ? 'Checking…' : isHealthy ? 'Healthy' : 'Error'}
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">
        {loading
          ? 'Verifying API and stack status…'
          : error
            ? `Could not reach health endpoint: ${error}`
            : isHealthy
              ? 'All systems operational. The base app is ready for development.'
              : 'Health check reported an issue.'}
      </p>
      <ul className="space-y-2 text-sm text-slate-600">
        <li className="flex items-center gap-2">
          <CheckIcon />
          Next.js App Router configured
        </li>
        <li className="flex items-center gap-2">
          <CheckIcon />
          TypeScript strict mode
        </li>
        <li className="flex items-center gap-2">
          <CheckIcon />
          TailwindCSS integrated
        </li>
        {status?.timestamp && (
          <li className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </li>
        )}
      </ul>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-pasture-moss" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
    </svg>
  );
}
