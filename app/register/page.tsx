'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpPage, Testimonial } from '@/components/ui';
import { signInWithGoogle } from '@/lib/auth';
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

export default function RegisterPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailPasswordRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading('credentials');

    try {
      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(null);
        return;
      }

      // Si l'inscription réussit, l'utilisateur est automatiquement connecté
      // Rediriger vers la page d'accueil
      if (data.user) {
        router.push('/');
      } else {
        // Si l'email nécessite une confirmation, informer l'utilisateur
        setError('Veuillez vérifier votre email pour confirmer votre compte');
        setLoading(null);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Une erreur est survenue');
      setLoading(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading('google');
    setError('');

    try {
      const redirectToUrl = `${window.location.origin}/auth/callback?callbackUrl=${encodeURIComponent('/')}`;
      await signInWithGoogle(redirectToUrl);
      // La redirection se fait automatiquement par Supabase
    } catch (error: any) {
      console.error('OAuth error:', error);
      setError('Erreur lors de la connexion avec Google');
      setLoading(null);
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <SignUpPage
      title={<span className="font-light text-foreground tracking-tighter">Create account</span>}
      description="Join us and start your journey today"
      heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80"
      testimonials={sampleTestimonials}
      onSignUp={handleEmailPasswordRegister}
      onGoogleSignIn={handleGoogleSignIn}
      onSignIn={handleSignIn}
      error={error}
      isLoading={loading !== null}
    />
  );
}
