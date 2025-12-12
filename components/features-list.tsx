'use client';

import { RefreshCw } from 'lucide-react';
import { Card, CardTitle, Badge } from '@/components/ui';
import { FeatureCard } from '@/components/features';
import { Feature } from '@/types';

interface FeaturesListProps {
  features: Feature[];
  activeFeatureId: string | null;
  onSelectFeature: (id: string) => void;
  onDeleteFeature: (id: string) => void;
  onClear: () => void;
}

export function FeaturesList({
  features,
  activeFeatureId,
  onSelectFeature,
  onDeleteFeature,
  onClear,
}: FeaturesListProps) {
  if (features.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="flex items-center gap-2">
          Features Detected
          <Badge>{features.length}</Badge>
        </CardTitle>
        <button
          onClick={onClear}
          className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
          title="Clear all features"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            isActive={activeFeatureId === feature.id}
            onClick={() => onSelectFeature(feature.id)}
            onDelete={() => onDeleteFeature(feature.id)}
          />
        ))}
      </div>
    </Card>
  );
}
