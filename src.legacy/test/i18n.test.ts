import { describe, it, expect } from 'vitest';
import { t } from '@/lib/i18n';

describe('i18n', () => {
  it('returns English strings', () => {
    expect(t('en', 'captureImage')).toBe('Capture image');
  });

  it('returns Spanish strings', () => {
    expect(t('es', 'getResults')).toBe('Ver resultados');
  });

  it('returns Hindi strings', () => {
    expect(t('hi', 'aiAnalysis')).toBe('एआई विश्लेषण');
  });
});
