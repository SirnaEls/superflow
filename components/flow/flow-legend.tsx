import React from 'react';
import { NODE_CONFIGS } from '@/lib/constants';
import { NodeType } from '@/types';
import { HelpCircle } from 'lucide-react';

// ============================================
// Flow Legend Component
// ============================================

const LEGEND_ITEMS: NodeType[] = [
  'besoin',
  'besoin-valide',
  'action',
  'information',
  'description',
  'pain-point',
  'question',
];

export const FlowLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-900/30 rounded-lg border border-slate-800/50">
      {LEGEND_ITEMS.map((key) => {
        const config = NODE_CONFIGS[key];
        const isIcon = config.shape === 'icon';
        const isCylinder = config.shape === 'cylinder';
        
        return (
          <div key={key} className="flex items-center gap-2">
            {isIcon ? (
              <div className="w-4 h-4 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" style={{ color: config.color }} />
              </div>
            ) : isCylinder ? (
              <div
                className="w-4 h-4 rounded-lg relative overflow-hidden"
                style={{
                  backgroundColor: config.bgColor,
                  border: `1px solid ${config.color}`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                  style={{ backgroundColor: config.color, opacity: 0.3 }}
                />
              </div>
            ) : (
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: config.bgColor,
                  border: `1px solid ${config.color}`,
                }}
              />
            )}
            <span className="text-xs text-slate-400 font-medium">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
};
