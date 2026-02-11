import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePilotData } from '@/hooks/usePilotData';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePilotData', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches pilot data from /pilotdata/*.json', async () => {
    const mockFarms = [{ id: '1', name: 'Test Farm' }];
    const mockPaddocks: never[] = [];
    const mockWeekly: never[] = [];

    vi.spyOn(global, 'fetch').mockImplementation((url: string | URL) => {
      if (typeof url === 'string' && url.includes('pilotdata_farms')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFarms),
        } as Response);
      }
      if (typeof url === 'string' && url.includes('pilotdata_paddocks')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPaddocks),
        } as Response);
      }
      if (typeof url === 'string' && url.includes('pilotdata_weeklymetrics')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockWeekly),
        } as Response);
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const { result } = renderHook(() => usePilotData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.farms).toEqual(mockFarms);
    expect(result.current.data?.paddocks).toEqual(mockPaddocks);
    expect(result.current.data?.weekly).toEqual(mockWeekly);
  });
});
