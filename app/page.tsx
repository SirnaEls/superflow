'use client';

import React, { useState } from 'react';
import { InputMode, UploadedImage } from '@/types';
import { SAMPLE_INPUT } from '@/lib/constants';
import { useFlowGenerator } from '@/hooks';
import { Header } from '@/components/layout';
import { InputPanel, FeatureList, FlowViewer } from '@/components/features';

// ============================================
// Main Page Component
// ============================================

export default function FlowForgePage() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');

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

  const handleLoadSample = () => {
    setInputMode('text');
    setTextInput(SAMPLE_INPUT);
  };

  const handleGenerate = (images: UploadedImage[]) => {
    generateFlows(textInput, images, inputMode);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-indigo-950/20 pointer-events-none" />

        {/* Header */}
        <Header onLoadSample={handleLoadSample} />

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Input */}
          <div className="lg:col-span-4">
            <InputPanel
              inputMode={inputMode}
              onInputModeChange={setInputMode}
              textInput={textInput}
              onTextInputChange={setTextInput}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={error}
            />
          </div>

          {/* Right Panel - Features & Flow Viewer */}
          <div className="lg:col-span-8 space-y-6">
            <FeatureList
              features={features}
              activeFeatureId={activeFeatureId}
              onSelectFeature={setActiveFeatureId}
              onDeleteFeature={deleteFeature}
              onClearAll={clearFeatures}
            />

            <FlowViewer 
              activeFeature={activeFeature} 
              activeFeatureId={activeFeatureId}
              onUpdateNode={updateNode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
