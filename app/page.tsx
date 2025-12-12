'use client';

import React from 'react';
import { InputMode, UploadedImage } from '@/types';
import { useFlowGenerator } from '@/hooks';
import { Header } from '@/components/layout';
import { FloatingFeatures, FlowViewer, ChatBar } from '@/components/features';
import { FloatingLegend } from '@/components/flow';

// ============================================
// Main Page Component
// ============================================

export default function FlowForgePage() {

  const {
    features,
    activeFeatureId,
    isGenerating,
    error,
    generateFlows,
    setActiveFeatureId,
    deleteFeature,
    clearFeatures,
    updateNode,
    activeFeature,
  } = useFlowGenerator();

  const handleGenerate = async (text: string, images: UploadedImage[], mode: InputMode) => {
    await generateFlows(text, images, mode);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-indigo-950/20 pointer-events-none" />

      {/* Header */}
      <Header />

      {/* Main Content - Whiteboard full screen */}
      <div className="flex-1 overflow-hidden pb-32 relative">
        {/* Flow Viewer - Takes full space */}
        <FlowViewer 
          activeFeature={activeFeature} 
          activeFeatureId={activeFeatureId}
          onUpdateNode={updateNode}
        />

        {/* Floating Features - Top Right */}
        <FloatingFeatures
          features={features}
          activeFeatureId={activeFeatureId}
          onSelectFeature={setActiveFeatureId}
          onDeleteFeature={deleteFeature}
          onClearAll={clearFeatures}
        />

        {/* Floating Legend - Bottom Right */}
        <FloatingLegend />
      </div>

      {/* Chat Bar - Fixed at bottom */}
      <ChatBar
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        error={error}
      />
    </div>
  );
}
