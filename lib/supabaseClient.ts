'use client';

type SupabaseClient = unknown;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Supabase env vars not set. Using null client.');
    return null;
  }

  // Lazy-load @supabase/supabase-js when adding Supabase integration
  // import { createClient } from '@supabase/supabase-js';
  // return createClient(url, key);
  return null;
}
