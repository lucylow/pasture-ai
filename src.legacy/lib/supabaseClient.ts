'use client';

import { createClient } from '@supabase/supabase-js';
import { env, hasSupabase } from './env';

let browserClient: ReturnType<typeof createClient> | null = null;

/**
 * Returns Supabase client for browser use only. Safe for Lovable Cloud + Supabase.
 * Use in client components. Throws when env vars are missing.
 */
export function getBrowserSupabase() {
  if (!hasSupabase) {
    throw new Error(
      'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Lovable Integrations.'
    );
  }
  if (!browserClient) {
    browserClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    });
  }
  return browserClient;
}

/**
 * Returns Supabase client or null if not configured (e.g. demo mode without Supabase).
 */
export function getSupabaseOrNull() {
  if (!hasSupabase) return null;
  try {
    return getBrowserSupabase();
  } catch {
    return null;
  }
}
