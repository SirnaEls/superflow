'use client';

/**
 * SessionProvider - Wrapper pour compatibilité
 * 
 * Avec Supabase Auth, on n'a pas besoin d'un provider spécial car Supabase
 * gère la session automatiquement via le client Supabase.
 * Ce composant est conservé pour compatibilité mais ne fait rien.
 */

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Supabase gère la session automatiquement, pas besoin de provider
  return <>{children}</>;
}
