'use client';

import React, { useState } from 'react';
import { Feature } from '@/types';
import { FlowCanvas } from '@/components/flow';

// ============================================
// Flow Viewer Component
// ============================================

interface FlowViewerProps {
  activeFeature: Feature | undefined;
  activeFeatureId: string | null;
  onUpdateNode: (featureId: string, nodeId: string, updates: { label?: string; details?: string[] }) => void;
}

export const FlowViewer: React.FC<FlowViewerProps> = ({ 
  activeFeature, 
  activeFeatureId,
  onUpdateNode 
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleExport = () => {
    // TODO: Implement export functionality (SVG, PNG, Figma API)
    console.log('Export flow:', activeFeature);
    alert('Export functionality coming soon!');
  };

  return (
    <div className="w-full h-full absolute inset-0">
      {/* Flow Canvas - Whiteboard style (full screen) */}
      {activeFeature && activeFeatureId ? (
        <FlowCanvas
          flow={activeFeature.flow}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          featureId={activeFeatureId}
          onUpdateNode={onUpdateNode}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-slate-400 text-sm">Sélectionnez une feature pour voir le flow</p>
        </div>
      )}
    </div>
  );
};
