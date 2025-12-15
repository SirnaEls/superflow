'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Zap, Sparkles, Crown } from 'lucide-react';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { CheckoutButton } from '@/components/payment/checkout-button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceId?: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  cta: string;
  highlight?: string;
}

export default function UpgradePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?callbackUrl=/upgrade');
    }
  }, [user, loading, router]);

  // Get price IDs from environment variables (available client-side with NEXT_PUBLIC_ prefix)
  // Support both naming conventions for backward compatibility
  const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '';
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_2 || '';

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: '€0',
      features: [
        '5 generations per month',
        '10 flows in history',
        'Edit nodes',
        'Whiteboard zoom & pan',
      ],
      icon: <Zap className="w-6 h-6" />,
      cta: 'Current Plan',
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'For individuals and small teams',
      price: '€4.99',
      priceId: starterPriceId,
      features: [
        '50 generations per month',
        '100 flows in history',
        'Edit nodes',
        'Whiteboard zoom & pan',
        'Export PNG/SVG',
        'Email support',
      ],
      icon: <Sparkles className="w-6 h-6" />,
      popular: true,
      cta: 'Upgrade to Starter',
      highlight: 'Most Popular',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For power users and agencies',
      price: '€9.99',
      priceId: proPriceId,
      features: [
        'Unlimited generations',
        'Unlimited history',
        'Edit nodes',
        'Whiteboard zoom & pan',
        'Export PNG/SVG',
        'Export to Figma',
        'Priority support',
      ],
      icon: <Crown className="w-6 h-6" />,
      cta: 'Upgrade to Pro',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-slate-400 text-lg">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'border-indigo-500 border-2' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {plan.highlight}
                  </span>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white">
                    {plan.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== '$0' && (
                      <span className="text-slate-400">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === 'free' ? (
                  <Button className="w-full" disabled>
                    {plan.cta}
                  </Button>
                ) : plan.priceId ? (
                  <CheckoutButton priceId={plan.priceId} className="w-full">
                    {plan.cta}
                  </CheckoutButton>
                ) : (
                  <Button className="w-full" variant="secondary">
                    {plan.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Need help choosing? <Link href="/contact" className="text-indigo-400 hover:text-indigo-300">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
