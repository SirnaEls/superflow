import React from 'react';
import Image from 'next/image';
import { CheckoutButton } from '@/components/payment/checkout-button';

// ============================================
// Header Component
// ============================================

export const Header: React.FC = () => {
  return (
    <header className="relative border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={120} 
            height={120} 
            className="object-contain h-9 w-auto"
          />

          {/* Actions */}
          <div className="flex items-center gap-3">
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
