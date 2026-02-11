'use client';

import { useEffect, useState } from 'react';

export type PredictionHistoryItem = {
  id: string;
  createdAt: string;
  biomass_gm2: number;
  recommendation: string;
};

const STORAGE_KEY = 'pastureai.history.v1';

export function useLocalHistory() {
  const [items, setItems] = useState<PredictionHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  function addItem(item: PredictionHistoryItem) {
    setItems((prev) => [item, ...prev].slice(0, 50));
  }

  return { items, addItem };
}
