export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  /** Backend API base URL. Empty = use same origin (Next.js proxy). Set for external backend. */
  apiBase: process.env.NEXT_PUBLIC_API_BASE || '',
};
