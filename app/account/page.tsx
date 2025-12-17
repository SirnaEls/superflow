'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, CreditCard, Settings, LogOut, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { CheckoutButton } from '@/components/payment/checkout-button';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { usePlan } from '@/hooks/use-plan';
import { useRouter } from 'next/navigation';
import { PlanType } from '@/lib/plans';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription'>('profile');
  const { user, loading } = useAuth();
  const { plan, currentGenerations, remainingGenerations, limits } = usePlan();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login?callbackUrl=/account');
    }
  }, [user, loading, router]);

  // Show loading state
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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get plan features based on current plan
  const getPlanFeatures = (planType: PlanType): string[] => {
    switch (planType) {
      case 'free':
        return [
          '5 generations per month',
          '10 flows in history',
          'Edit nodes',
          'Whiteboard zoom & pan',
        ];
      case 'starter':
        return [
          '50 generations per month',
          '100 flows in history',
          'Edit nodes',
          'Whiteboard zoom & pan',
          'Export PNG/SVG',
          'Email support',
        ];
      case 'pro':
        return [
          'Unlimited generations',
          'Unlimited history',
          'Edit nodes',
          'Whiteboard zoom & pan',
          'Export PNG/SVG',
          'Priority support',
        ];
      default:
        return [];
    }
  };

  const planFeatures = getPlanFeatures(plan);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-slate-400">Manage your account and subscription</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={activeTab === 'profile' 
              ? 'px-4 py-2 border-b-2 border-indigo-500 text-white' 
              : 'px-4 py-2 text-slate-400 hover:text-white'}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={activeTab === 'subscription' 
              ? 'px-4 py-2 border-b-2 border-indigo-500 text-white' 
              : 'px-4 py-2 text-slate-400 hover:text-white'}
          >
            Subscription
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="w-16 h-16 rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-[#F0EEE9]" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">{user?.name || 'User'}</CardTitle>
                  <p className="text-slate-400">{user?.email || ''}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    disabled
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <CardTitle className="text-xl mb-2">Current Plan</CardTitle>
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-4 py-2 bg-slate-800 rounded-lg">
                    <span className="text-lg font-semibold capitalize">{plan}</span>
                  </div>
                </div>
                
                {/* Usage Stats */}
                {limits.generationsPerMonth !== -1 && (
                  <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Usage this month</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">
                        {currentGenerations} / {limits.generationsPerMonth} generations
                      </span>
                      <span className="text-slate-400 text-sm">
                        {remainingGenerations} remaining
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(100, (currentGenerations / limits.generationsPerMonth) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Features Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
                  {plan === 'pro' ? (
                    <p className="text-slate-400 mb-4">
                      You're on the highest plan! Here are all the features you have access to:
                    </p>
                  ) : plan === 'starter' ? (
                    <p className="text-slate-400 mb-4">
                      Here are the features included in your Starter plan. Upgrade to Pro for even more:
                    </p>
                  ) : (
                    <p className="text-slate-400 mb-4">
                      Get more generations and features with a paid plan
                    </p>
                  )}
                  
                  {/* Features List */}
                  <div className="mb-4 space-y-2">
                    {planFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Upgrade Button for Free plan */}
                  {plan === 'free' && (
                    <Link href="/upgrade">
                      <Button className="w-full">
                        View Plans & Upgrade
                      </Button>
                    </Link>
                  )}

                  {/* Upgrade Button for Starter plan (upgrade to Pro) */}
                  {plan === 'starter' && (
                    <Link href="/upgrade">
                      <Button className="w-full">
                        Upgrade to Pro
                      </Button>
                    </Link>
                  )}
                  
                  {/* Message for Pro users */}
                  {plan === 'pro' && (
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                      <p className="text-slate-300 text-sm text-center">
                        🎉 You have access to all premium features!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
