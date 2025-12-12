'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Feature } from '@/types';
import { Card, CardContent, Badge } from '@/components/ui';
import { FeatureCard } from './feature-card';

// ============================================
// Feature List Component
// ============================================

interface FeatureListProps {
  features: Feature[];
  activeFeatureId: string | null;
  onSelectFeature: (id: string) => void;
  onDeleteFeature: (id: string) => void;
  onClearAll: () => void;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  features,
  activeFeatureId,
  onSelectFeature,
  onDeleteFeature,
  onClearAll,
}) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Features Detected
            <Badge variant="primary">{features.length}</Badge>
          </h2>
          <button
            type="button"
            onClick={onClearAll}
            className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
            title="Clear all features"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {features.map((feature) => (
            <div key={feature.id} className="flex-shrink-0 min-w-[280px] max-w-[320px]">
              <FeatureCard
                feature={feature}
                isActive={activeFeatureId === feature.id}
                onClick={() => onSelectFeature(feature.id)}
                onDelete={() => onDeleteFeature(feature.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
