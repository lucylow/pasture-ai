import { env } from './env';

export function getSupabaseServerClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  // Lazy-load @supabase/auth-helpers-nextjs or @supabase/ssr when adding Supabase:
  // import { cookies } from 'next/headers';
  // const cookieStore = await cookies();
  // return createServerClient(env.supabaseUrl, env.supabaseAnonKey, { cookies: { get: (n) => cookieStore.get(n)?.value } });
  return null;
}
