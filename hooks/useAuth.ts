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
    let mounted = true;

    // Récupérer la session initiale
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setError(error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ? mapSupabaseUserToAuthUser(session.user) : null);
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Log pour le débogage en production
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', event, session?.user?.email);
      }

      setSession(session);
      setUser(session?.user ? mapSupabaseUserToAuthUser(session.user) : null);
      setLoading(false);
      setError(null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, error };
}
