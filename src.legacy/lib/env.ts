/**
 * Centralized environment configuration for Lovable Cloud + Supabase.
 * In Lovable: configure via Integrations → Supabase and Secrets (VITE_MAPBOX_TOKEN).
 * For Vite, use VITE_ prefix for client-exposed vars.
 */
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  mapboxToken:
    import.meta.env.VITE_MAPBOX_TOKEN ??
    import.meta.env.MAPBOX_TOKEN ??
    '',
  /** Inference API base for tiles & predict (e.g. http://localhost:8000) */
  apiBase: import.meta.env.VITE_API_BASE ?? '',
  nodeEnv: import.meta.env.MODE || 'development',
} as const;

export const hasSupabase = Boolean(
  env.supabaseUrl && env.supabaseAnonKey && env.supabaseUrl.startsWith('http')
);
