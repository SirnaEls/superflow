'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { FlowViewer } from '@/components/features';
import { Feature } from '@/types';
import { getFlow, updateFlow } from '@/lib/storage';
import Link from 'next/link';

export default function FlowDetailPage() {
  const params = useParams();
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center">
        <div className="text-slate-400">Chargement...</div>
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
    <div className="min-h-screen bg-[#0A0A0F] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/history">
            <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{flow.name}</h1>
            <p className="text-slate-400">
              {flow.features.length} feature{flow.features.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <FlowViewer 
          activeFeature={activeFeature} 
          activeFeatureId={activeFeatureId}
          onUpdateNode={handleUpdateNode}
        />
      </div>
    </div>
  );
}

