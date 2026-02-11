/**
 * Centralized API client for PastureAI backend integration.
 * Uses relative URLs when apiBase is empty (Next.js proxy handles /api/v1/*),
 * or absolute URLs when NEXT_PUBLIC_API_BASE is set (e.g. production).
 */

import { env } from './env';

const API_BASE = env.apiBase || '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Build full URL for an API path (e.g. /api/v1/sustainability/plan) */
export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

/** Fetch from API with error handling and JSON parsing */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(
      (body as { error?: string; detail?: string })?.error ||
        (body as { error?: string; detail?: string })?.detail ||
        res.statusText ||
        `Request failed (${res.status})`,
      res.status,
      body
    );
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.blob() as unknown as Promise<T>;
}

/** POST JSON to API */
export async function apiPost<T = unknown>(
  path: string,
  body: unknown,
  options: Omit<RequestInit, 'body' | 'method'> = {}
): Promise<T> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
}

/** POST FormData (e.g. file upload) - omits Content-Type so browser sets boundary */
export async function apiPostForm<T = unknown>(
  path: string,
  formData: FormData,
  options: Omit<RequestInit, 'body' | 'method' | 'headers'> = {}
): Promise<T> {
  const url = apiUrl(path);
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    ...options,
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new ApiError(
      (body as { error?: string; detail?: string })?.error ||
        (body as { error?: string; detail?: string })?.detail ||
        res.statusText ||
        `Request failed (${res.status})`,
      res.status,
      body
    );
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.blob() as unknown as Promise<T>;
}

/** Check if backend is reachable (uses /api/v1/mock/models as lightweight probe) */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(apiUrl('/api/v1/mock/models'));
    return res.ok;
  } catch {
    return false;
  }
}
