/**
 * Module d'authentification Supabase
 * 
 * Ce module centralise toute la logique d'authentification en utilisant uniquement Supabase Auth.
 * Il remplace complètement NextAuth et Prisma pour l'authentification.
 */

import { supabaseClient } from './supabase-client';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Interface pour l'utilisateur authentifié
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string; // Toujours défini grâce à mapSupabaseUserToAuthUser
  avatar?: string;
}

/**
 * Connexion avec Google OAuth
 */
export async function signInWithGoogle(redirectTo?: string) {
  // S'assurer qu'on a une URL valide
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const defaultRedirectTo = `${origin}/auth/callback`;
  const finalRedirectTo = redirectTo || defaultRedirectTo;

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: finalRedirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }

  return data;
}

/**
 * Déconnexion
 */
export async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Récupère la session actuelle (côté client)
 */
export async function getSession(): Promise<Session | null> {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return session;
}

/**
 * Récupère l'utilisateur actuel (côté client)
 */
export async function getUser(): Promise<User | null> {
  const { data: { user }, error } = await supabaseClient.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }

  return user;
}

/**
 * Convertit un User Supabase en AuthUser
 */
export function mapSupabaseUserToAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined,
  };
}

/**
 * Écoute les changements d'authentification
 */
export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabaseClient.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
