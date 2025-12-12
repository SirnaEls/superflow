'use client';

import React from 'react';
import { UserFlow, FlowNode as FlowNodeType } from '@/types';
import { FlowNode } from './flow-node';
import { ConnectionArrow } from './connection-arrow';

// ============================================
// Flow Canvas Component
// ============================================

interface FlowCanvasProps {
  flow: UserFlow | undefined;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  featureId: string;
  onUpdateNode: (featureId: string, nodeId: string, updates: { label?: string; details?: string[] }) => void;
}

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  flow,
  selectedNodeId,
  onSelectNode,
  featureId,
  onUpdateNode,
}) => {
  if (!flow || !flow.nodes || flow.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <p className="text-sm">No flow generated yet</p>
      </div>
    );
  }

  // Organize nodes in sequential order
  const nodes = flow.nodes;

  return (
    <div className="overflow-x-auto overflow-y-hidden bg-[#0A0A0F] rounded-xl border border-slate-800/50 min-h-[300px]">
      <div className="flex items-center gap-8 p-10 min-w-max">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <FlowNode
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={onSelectNode}
              featureId={featureId}
              onUpdateNode={onUpdateNode}
            />
            {index < nodes.length - 1 && (
              <ConnectionArrow label={node.connectionLabel} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
