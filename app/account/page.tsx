'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, CreditCard, Settings, LogOut, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { CheckoutButton } from '@/components/payment/checkout-button';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'settings'>('profile');
  const { user, loading } = useAuth();
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
        <div className="text-slate-400">Chargement...</div>
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
          <button
            onClick={() => setActiveTab('settings')}
            className={activeTab === 'settings' 
              ? 'px-4 py-2 border-b-2 border-indigo-500 text-white' 
              : 'px-4 py-2 text-slate-400 hover:text-white'}
          >
            Settings
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
                    <User className="w-8 h-8 text-white" />
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
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-slate-800 rounded-lg">
                    <span className="text-lg font-semibold">Gratuit</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Upgrade to Pro</h3>
                  <ul className="space-y-2 mb-6 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Unlimited user flows
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Priority AI processing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Export to Figma
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Advanced customization
                    </li>
                  </ul>
                  <Link href="/upgrade">
                    <Button className="w-full">
                      Voir tous les plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <CardTitle className="text-lg mb-4">Preferences</CardTitle>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-slate-300">Email notifications</span>
                      <input type="checkbox" className="toggle" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-slate-300">Auto-save flows</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <Button 
                    variant="danger" 
                    leftIcon={<LogOut className="w-4 h-4" />}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
