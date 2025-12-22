'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { InputMode, UploadedImage } from '@/types';
import { useFlowGenerator } from '@/hooks';
import { Header } from '@/components/layout';
import { FloatingFeatures, FlowViewer, ChatBar } from '@/components/features';

// ============================================
// Main Page Component
// ============================================

export default function FlowForgePage() {
  const pathname = usePathname();

  const {
    features,
    activeFeatureId,
    isGenerating,
    error,
    generateFlows,
    loadExample,
    setActiveFeatureId,
    deleteFeature,
    clearFeatures,
    updateNode,
    activeFeature,
  } = useFlowGenerator();

  // Listen for reset-features event from sidebar logo click
  useEffect(() => {
    const handleResetFeatures = () => {
      clearFeatures();
    };

    window.addEventListener('reset-features', handleResetFeatures);
    return () => {
      window.removeEventListener('reset-features', handleResetFeatures);
    };
  }, [clearFeatures]);


  const handleGenerate = async (text: string, images: UploadedImage[], mode: InputMode) => {
    await generateFlows(text, images, mode);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-indigo-950/20 pointer-events-none" />

      {/* Header */}
      <Header hasActiveFlow={features.length > 0} />

      {/* Main Content - Whiteboard full screen */}
      <div className="flex-1 overflow-hidden pb-32 relative">
        {/* Flow Viewer - Takes full space */}
        <FlowViewer 
          activeFeature={activeFeature} 
          activeFeatureId={activeFeatureId}
          onUpdateNode={updateNode}
          onLoadExample={loadExample}
          hasFeatures={features.length > 0}
        />

        {/* Floating Features - Top Right */}
        <FloatingFeatures
          features={features}
          activeFeatureId={activeFeatureId}
          onSelectFeature={setActiveFeatureId}
          onDeleteFeature={deleteFeature}
          onClearAll={clearFeatures}
        />
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
