'use client';

import { Feature } from '@/types';
import { Badge } from '@/components/ui';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function FeatureCard({ feature, isActive, onClick, onDelete }: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
        isActive
          ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10'
          : 'border-white/10 bg-white/[0.02] hover:border-violet-500/50 hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              'font-semibold truncate',
              isActive ? 'text-violet-300' : 'text-slate-200'
            )}
          >
            {feature.name}
          </h4>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{feature.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge>
              {feature.flow?.nodes?.length || 0} steps
            </Badge>
            {feature.priority && (
              <Badge variant="primary">
                {feature.priority}
              </Badge>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
