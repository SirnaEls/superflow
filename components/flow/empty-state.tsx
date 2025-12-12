import React from 'react';
import { Sparkles } from 'lucide-react';

// ============================================
// Empty State Component
// ============================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-slate-500">
      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
        {icon || <Sparkles className="w-8 h-8 text-slate-600" />}
      </div>
      <p className="text-lg font-medium mb-2">{title}</p>
      <p className="text-sm text-slate-600 text-center max-w-md">
        {description}
      </p>
    </div>
  );
};
