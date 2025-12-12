'use client';

import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Feature } from '@/types';
import { Badge } from '@/components/ui';
import { FeatureCard } from './feature-card';

// ============================================
// Floating Features Component
// ============================================

interface FloatingFeaturesProps {
  features: Feature[];
  activeFeatureId: string | null;
  onSelectFeature: (id: string) => void;
  onDeleteFeature: (id: string) => void;
  onClearAll: () => void;
}

export const FloatingFeatures: React.FC<FloatingFeaturesProps> = ({
  features,
  activeFeatureId,
  onSelectFeature,
  onDeleteFeature,
  onClearAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (features.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-24 right-4 z-50 max-w-md">
      <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#212121]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">
              Features
            </h2>
            <Badge variant="primary" className="text-xs">{features.length}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClearAll}
              className="p-1.5 text-white/40 hover:text-white/60 transition-colors rounded hover:bg-white/5"
              title="Clear all features"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-white/40 hover:text-white/60 transition-colors rounded hover:bg-white/5"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-3 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

