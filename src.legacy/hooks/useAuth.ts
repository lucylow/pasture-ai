'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseOrNull } from '@/lib/supabaseClient';
import { lovable, user as userStore } from '@/lib/lovable';

/** Unified auth: Supabase when configured, else Lovable mock. */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const supabase = getSupabaseOrNull();
      if (supabase) {
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session ?? null);
          setLoading(false);
        });
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession);
        });
        return () => subscription.unsubscribe();
      }
    } catch {
      // Supabase not configured
    }
    userStore.subscribe((val) => setSession(val ? ({ user: val } as unknown as Session) : null));
    setLoading(false);
    return () => {};
  }, []);

  return { session, loading };
}

/** Legacy alias for Lovable mock auth. */
export function useLovableAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = userStore.subscribe((value) => setUser(value));
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { user: u, error } = await lovable.auth.signInWithPassword({ email, password });
    if (u) userStore.set(u);
    return { user: u, error };
  }, []);

  const signOut = useCallback(async () => {
    await lovable.auth.signOut();
    userStore.set(null);
  }, []);

  return { user, signIn, signOut };
}
