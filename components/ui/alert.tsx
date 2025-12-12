import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

// ============================================
// Alert Component
// ============================================

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

const variants = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  success: 'bg-green-500/10 border-green-500/20 text-green-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-400',
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className,
}) => {
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border text-sm',
        variants[variant],
        className
      )}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
};
