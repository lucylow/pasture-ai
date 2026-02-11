'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-slate-600">An unexpected error occurred.</p>
        <div className="mt-6">
          <button onClick={() => reset()} className="px-4 py-2 bg-pasture-moss text-white rounded">Retry</button>
        </div>
      </div>
    </div>
  );
}
