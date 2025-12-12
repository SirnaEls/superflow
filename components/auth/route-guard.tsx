'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * RouteGuard - Protège les routes nécessitant une authentification
 * 
 * Utilise Supabase Auth via le hook useAuth pour vérifier l'authentification.
 */
export function RouteGuard({ 
  children, 
  requireAuth = false,
  redirectTo = '/login' 
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still loading

    if (requireAuth && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-slate-400">Chargement...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
