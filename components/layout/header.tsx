import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { CheckoutButton } from '@/components/payment/checkout-button';

// ============================================
// Header Component
// ============================================

interface HeaderProps {
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample }) => {
  return (
    <header className="relative border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FlowForge</h1>
              <p className="text-xs text-slate-400">Post-its → User Flows</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onLoadSample}>
              Load Sample
            </Button>
            {process.env.NEXT_PUBLIC_STRIPE_PRICE_ID && (
              <CheckoutButton priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ID}>
                Upgrade
              </CheckoutButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
