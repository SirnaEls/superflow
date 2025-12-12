/**
 * Hook React pour gérer l'authentification Supabase
 * 
 * Remplace useSession de NextAuth par une implémentation basée sur Supabase Auth
 */

'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import { mapSupabaseUserToAuthUser, type AuthUser } from '@/lib/auth';
import type { Session } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour récupérer l'état d'authentification actuel
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Récupérer la session initiale
    supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ? mapSupabaseUserToAuthUser(session.user) : null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ? mapSupabaseUserToAuthUser(session.user) : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, error };
}
