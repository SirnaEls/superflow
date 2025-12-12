import React from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Toggle Group Component
// ============================================

interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex gap-2 p-1 bg-white/5 rounded-xl', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
            'text-sm font-medium transition-all',
            value === option.value
              ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
              : 'text-slate-400 hover:text-white'
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};
