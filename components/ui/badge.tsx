import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Badge Component
// ============================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-violet-500/20 text-violet-300',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={cn(
        'text-xs px-2 py-0.5 rounded-full font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
