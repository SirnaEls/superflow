import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl',
            'text-white placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
            'transition-all',
            error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
