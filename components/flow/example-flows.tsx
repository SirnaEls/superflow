'use client';

import React from 'react';
import { Feature } from '@/types';
import { EXAMPLE_FLOWS } from '@/lib/example-flows';
import { Sparkles, ShoppingCart, UserPlus, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExampleFlowsProps {
  onSelectExample: (example: Feature) => void;
}

const exampleIcons = {
  'E-commerce Checkout': ShoppingCart,
  'User Sign Up': UserPlus,
  'Password Reset': KeyRound,
};

export const ExampleFlows: React.FC<ExampleFlowsProps> = ({ onSelectExample }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#212121]/50 mb-4">
          <Sparkles className="w-8 h-8 text-[#E75B13]" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Try an example flow</h2>
        <p className="text-slate-400 text-sm max-w-md">
          Click on an example below to see how SupaFlow works. These are pre-built flows you can explore and customize.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
        {EXAMPLE_FLOWS.map((example) => {
          const Icon = exampleIcons[example.name as keyof typeof exampleIcons] || Sparkles;
          
          return (
            <button
              key={example.id}
              onClick={() => onSelectExample(example)}
              className={cn(
                'group relative p-6 rounded-xl border-2 transition-all duration-200',
                'bg-white/5 border-white/10 hover:border-[#E75B13]/50 hover:bg-white/10',
                'text-left cursor-pointer'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#E75B13]/20 flex items-center justify-center group-hover:bg-[#E75B13]/30 transition-colors">
                  <Icon className="w-6 h-6 text-[#E75B13]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#E75B13] transition-colors">
                    {example.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {example.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#E75B13]/20 text-[#E75B13] border border-[#E75B13]/30">
                      {example.flow.nodes.length} steps
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 mt-8 text-center">
        Or describe your own user flow in the input below
      </p>
    </div>
  );
};

