'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase-client';

/**
 * Page de callback pour l'authentification OAuth Supabase
 * 
 * Cette page gère le retour après authentification Google via Supabase.
 * Supabase redirige vers cette page avec les tokens dans le hash de l'URL.
 */
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleCallback = async () => {
      const callbackUrl = searchParams.get('callbackUrl') || '/';

      try {
        // Lire le hash de l'URL (Supabase envoie les tokens dans le hash avec le flux implicit)
        const hash = window.location.hash.substring(1); // Enlever le '#'
        const hashParams = new URLSearchParams(hash);
        
        // Vérifier aussi les query params (certaines configurations Supabase utilisent query params)
        const queryParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
        const errorParam = hashParams.get('error') || queryParams.get('error');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');

        // Vérifier s'il y a une erreur
        if (errorParam) {
          setError(errorDescription || errorParam || 'Erreur lors de l\'authentification');
          setStatus('error');
          setTimeout(() => {
            router.push(`/login?error=${encodeURIComponent(errorParam)}`);
          }, 2000);
          return;
        }

        // Si on a un access_token, créer une session Supabase
        if (accessToken && refreshToken) {
          const { data, error: setSessionError } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError || !data.session) {
            console.error('Error setting Supabase session:', setSessionError);
            setError('Erreur lors de la création de la session Supabase');
            setStatus('error');
            setTimeout(() => {
              router.push('/login?error=session_error');
            }, 2000);
            return;
          }

          // Session créée avec succès, nettoyer l'URL et attendre un peu pour que la session soit persistée
          window.history.replaceState(null, '', window.location.pathname);
          setStatus('success');
          
          // Attendre un peu pour s'assurer que la session est bien persistée
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Vérifier que la session est bien créée avant de rediriger
          const { data: { session: verifySession } } = await supabaseClient.auth.getSession();
          if (verifySession) {
            router.push(callbackUrl);
          } else {
            setError('La session n\'a pas pu être créée');
            setStatus('error');
            setTimeout(() => {
              router.push('/login?error=session_not_created');
            }, 2000);
          }
          return;
        }

        // Si pas de token dans l'URL, vérifier si on a une session Supabase existante
        // (peut arriver si l'utilisateur revient sur cette page alors qu'il est déjà connecté)
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        
        if (session) {
          // Session existante trouvée, rediriger
          window.history.replaceState(null, '', window.location.pathname);
          setStatus('success');
          router.push(callbackUrl);
          return;
        }

        // Pas de token et pas de session - erreur
        if (sessionError) {
          console.error('Session error:', sessionError);
        }
        
        setError('Token d\'accès introuvable dans l\'URL');
        setStatus('error');
        setTimeout(() => {
          router.push('/login?error=no_token');
        }, 2000);
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(err.message || 'Erreur lors du traitement du callback');
        setStatus('error');
        setTimeout(() => {
          router.push('/login?error=callback_error');
        }, 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Erreur</h1>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
        <p className="text-slate-400">
          {status === 'processing' && 'Connexion en cours...'}
          {status === 'success' && 'Redirection...'}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
