'use client';

import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';

const KEY = 'pastureai.lang.v1';

export function useLang() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(KEY) as Lang | null;
    if (stored && ['en', 'es', 'hi'].includes(stored)) {
      setLang(stored);
    }
  }, []);

  function change(newLang: Lang) {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(KEY, newLang);
    }
  }

  return { lang, change };
}
