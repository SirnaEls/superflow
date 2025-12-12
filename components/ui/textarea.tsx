import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Textarea Component
// ============================================

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  className,
  error,
  ...props
}) => {
  return (
    <div className="w-full">
      <textarea
        className={cn(
          'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl',
          'text-sm text-slate-200 placeholder-slate-500',
          'focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20',
          'resize-none transition-all',
          error &&
            'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
};
