'use client';

import React, { useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { Feature } from '@/types';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import { FlowCanvas, FlowLegend, EmptyState } from '@/components/flow';

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
    <Card className="min-h-[600px]">
      <CardContent>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <CardTitle icon={<ArrowRight className="w-5 h-5 text-violet-400" />}>
            {activeFeature ? activeFeature.name : 'User Flow'}
          </CardTitle>
          {activeFeature && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExport}
            >
              Export
            </Button>
          )}
        </div>

        {/* Legend */}
        <FlowLegend />

        {/* Flow Canvas */}
        <div className="mt-6">
          {activeFeature && activeFeatureId ? (
            <FlowCanvas
              flow={activeFeature.flow}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              featureId={activeFeatureId}
              onUpdateNode={onUpdateNode}
            />
          ) : (
            <EmptyState
              title="No flow generated yet"
              description="Import your FigJam post-its and click 'Generate User Flows' to automatically create visual user flows"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
