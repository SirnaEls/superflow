'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Feature } from '@/types';
import { cn, getPriorityStyles } from '@/lib/utils';
import { Badge } from '@/components/ui';

// ============================================
// Feature Card Component
// ============================================

interface FeatureCardProps {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  isActive,
  onClick,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={cn(
        'group relative p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer h-full',
        isActive
          ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-100'
          : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md'
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4
            className={cn(
              'font-semibold text-sm truncate flex-1',
              isActive ? 'text-violet-900' : 'text-slate-800'
            )}
          >
            {feature.name}
          </h4>
          <button
            type="button"
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-500 transition-all flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 mb-2 flex-1">
          {feature.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="text-xs">
            {feature.flow?.nodes?.length || 0} steps
          </Badge>
          {feature.priority && (
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                getPriorityStyles(feature.priority)
              )}
            >
              {feature.priority}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
