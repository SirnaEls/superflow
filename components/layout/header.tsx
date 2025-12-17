import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

// ============================================
// Header Component
// ============================================

export const Header: React.FC = () => {
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/upgrade">
              <Button className="!bg-[#E75B13] hover:!bg-[#D04F0F] !text-white font-medium shadow-lg shadow-black/20 focus:ring-[#E75B13] flex items-center gap-2">
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
