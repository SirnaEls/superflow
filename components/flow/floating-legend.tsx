'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { FlowLegend } from './flow-legend';

// ============================================
// Floating Legend Component
// ============================================

export const FloatingLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <div className="bg-[#1A1A1F] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 border-b border-white/10 bg-[#212121] hover:bg-[#2A2A2F] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-white/60" />
            <span className="text-sm font-semibold text-white">Legend</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronUp className="w-4 h-4 text-white/40" />
          )}
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="p-3">
            <FlowLegend />
          </div>
        )}
      </div>
    </div>
  );
};

