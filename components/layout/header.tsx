'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { FlowLegend } from '@/components/flow/flow-legend';

// ============================================
// Header Component
// ============================================

interface HeaderProps {
  hasActiveFlow?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hasActiveFlow = false }) => {
  return (
    <header className="relative border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Designed by Designers, for Designers
            </h1>
            <p className="text-xs text-white/50 mt-0.5">Transform ideas into flows</p>
          </div>

          {/* Legend - Only show when a userflow is generated */}
          {hasActiveFlow && (
            <div className="flex-1 flex justify-center mx-6">
              <FlowLegend />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/upgrade">
              <Button className="!bg-[#E75B13] hover:!bg-[#D04F0F] !text-white font-medium shadow-lg shadow-black/20 focus:ring-[#E75B13] flex items-center gap-2 border-0">
                <Sparkles className="w-4 h-4" />
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
