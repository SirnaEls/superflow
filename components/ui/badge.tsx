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
    default: 'bg-white/10 text-white/80',
    primary: 'bg-[#212121] text-white',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-red-500/20 text-red-400',
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
