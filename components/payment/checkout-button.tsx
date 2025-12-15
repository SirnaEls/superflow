'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { createCheckoutSession } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth';

interface CheckoutButtonProps {
  priceId: string;
  children?: React.ReactNode;
  className?: string;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  priceId,
  children,
  className,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const { url } = await createCheckoutSession(priceId, user?.email);
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
    >
      {loading ? 'Processing...' : children || 'Subscribe'}
    </Button>
  );
};

