import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalHistory } from '@/hooks/useLocalHistory';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useLocalHistory', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('adds history items and persists', () => {
    const { result } = renderHook(() => useLocalHistory());

    act(() => {
      result.current.addItem({
        id: '1',
        createdAt: new Date().toISOString(),
        biomass_gm2: 250,
        recommendation: 'Test',
      });
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].biomass_gm2).toBe(250);

    const stored = localStorageMock.getItem('pastureai.history.v1');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toHaveLength(1);
  });

  it('limits history to 50 items', () => {
    const { result } = renderHook(() => useLocalHistory());

    act(() => {
      for (let i = 0; i < 55; i++) {
        result.current.addItem({
          id: String(i),
          createdAt: new Date().toISOString(),
          biomass_gm2: i,
          recommendation: `Rec ${i}`,
        });
      }
    });

    expect(result.current.items.length).toBe(50);
  });
});
