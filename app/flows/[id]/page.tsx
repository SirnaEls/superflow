'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { FlowViewer, FloatingFeatures } from '@/components/features';
import { Header } from '@/components/layout';
import { Feature } from '@/types';
import { getFlow, updateFlow } from '@/lib/storage';
import Link from 'next/link';

export default function FlowDetailPage() {
  const params = useParams();
  const flowId = params.id as string;
  const [flow, setFlow] = useState<{ name: string; features: Feature[] } | null>(null);
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedFlow = getFlow(flowId);
    if (savedFlow) {
      setFlow(savedFlow);
      if (savedFlow.features.length > 0) {
        setActiveFeatureId(savedFlow.features[0].id);
      }
    }
    setLoading(false);
  }, [flowId]);

  const handleUpdateNode = (featureId: string, nodeId: string, updates: { label?: string; details?: string[] }) => {
    if (!flow) return;

    const updatedFeatures = flow.features.map((feature) => {
      if (feature.id !== featureId) return feature;

      return {
        ...feature,
        flow: {
          ...feature.flow,
          nodes: feature.flow.nodes.map((node) => {
            if (node.id !== nodeId) return node;
            return {
              ...node,
              label: updates.label !== undefined ? updates.label : node.label,
              details: updates.details !== undefined ? updates.details : node.details,
            };
          }),
        },
      };
    });

    const updatedFlow = { ...flow, features: updatedFeatures };
    setFlow(updatedFlow);
    updateFlow(flowId, updatedFlow);
  };

  const handleDeleteFeature = (id: string) => {
    if (!flow) return;

    const updatedFeatures = flow.features.filter((feature) => feature.id !== id);
    const updatedFlow = { ...flow, features: updatedFeatures };
    setFlow(updatedFlow);
    updateFlow(flowId, updatedFlow);

    // Update active feature if we deleted the active one
    if (activeFeatureId === id && updatedFeatures.length > 0) {
      setActiveFeatureId(updatedFeatures[0].id);
    } else if (updatedFeatures.length === 0) {
      setActiveFeatureId(null);
    }
  };

  const handleClearAll = () => {
    if (!flow) return;
    // For saved flows, clearing all would remove everything, so we'll just reset to empty
    const updatedFlow = { ...flow, features: [] };
    setFlow(updatedFlow);
    updateFlow(flowId, updatedFlow);
    setActiveFeatureId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!flow) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Flow introuvable</h1>
          <Link href="/history">
            <Button>Retour à l'historique</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeFeature = flow.features.find(f => f.id === activeFeatureId);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-indigo-950/20 pointer-events-none" />

      {/* Header with legend and upgrade button */}
      <Header hasActiveFlow={flow.features.length > 0} />

      {/* Main Content - Whiteboard full screen */}
      <div className="flex-1 overflow-hidden pb-32 relative">
        <FlowViewer 
          activeFeature={activeFeature} 
          activeFeatureId={activeFeatureId}
          onUpdateNode={handleUpdateNode}
        />

        {/* Floating Features - Top Right */}
        <FloatingFeatures
          features={flow.features}
          activeFeatureId={activeFeatureId}
          onSelectFeature={setActiveFeatureId}
          onDeleteFeature={handleDeleteFeature}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
}

