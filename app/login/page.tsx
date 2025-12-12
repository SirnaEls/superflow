'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInPage, Testimonial } from '@/components/ui';
import { signInWithGoogle } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { supabaseClient } from '@/lib/supabase-client';

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    name: 'Sarah Chen',
    handle: '@sarahdigital',
    text: 'Amazing platform! The user experience is seamless and the features are exactly what I needed.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    name: 'Marcus Johnson',
    handle: '@marcustech',
    text: 'This service has transformed how I work. Clean design, powerful features, and excellent support.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    name: 'David Martinez',
    handle: '@davidcreates',
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.",
  },
];

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState('/');
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Get callback URL from query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCallbackUrl(params.get('callbackUrl') || '/');
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(callbackUrl);
    }
  }, [user, authLoading, router, callbackUrl]);

  // Handle email/password login (if needed in the future)
  const handleEmailPasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading('credentials');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Email ou mot de passe incorrect');
        setLoading(null);
      } else {
        // La redirection se fera automatiquement via le useEffect ci-dessus
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Une erreur est survenue');
      setLoading(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError('');

    try {
      const redirectToUrl = `${window.location.origin}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      await signInWithGoogle(redirectToUrl);
      // La redirection se fait automatiquement par Supabase
    } catch (error: any) {
      console.error('OAuth error:', error);
      setError('Erreur lors de la connexion avec Google');
      setLoading(null);
    }
  };

  const handleResetPassword = () => {
    router.push('/reset-password');
  };

  const handleCreateAccount = () => {
    router.push('/register');
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0F]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <SignInPage
      title={<span className="font-light text-foreground tracking-tighter">Bienvenue sur FlowForge</span>}
      description="Connectez-vous pour continuer votre voyage avec nous"
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      testimonials={sampleTestimonials}
      onSignIn={handleEmailPasswordLogin}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
      error={error}
      isLoading={loading !== null}
    />
  );
}
