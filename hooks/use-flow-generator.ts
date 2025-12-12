'use client';

import { useState, useCallback, useEffect } from 'react';
import { Feature, UploadedImage, InputMode } from '@/types';
import { generateFlowsFromAPI } from '@/lib/utils';
import { saveFlow } from '@/lib/storage';

interface UseFlowGeneratorReturn {
  features: Feature[];
  activeFeatureId: string | null;
  isGenerating: boolean;
  error: string | null;
  generateFlows: (
    textInput: string,
    images: UploadedImage[],
    inputMode: InputMode
  ) => Promise<void>;
  setActiveFeatureId: (id: string | null) => void;
  deleteFeature: (id: string) => void;
  clearFeatures: () => void;
  updateNode: (featureId: string, nodeId: string, updates: { label?: string; details?: string[] }) => void;
  activeFeature: Feature | undefined;
}

export const useFlowGenerator = (): UseFlowGeneratorReturn => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlows = useCallback(
    async (textInput: string, images: UploadedImage[], inputMode: InputMode) => {
      setIsGenerating(true);
      setError(null);

      try {
        const generatedFeatures = await generateFlowsFromAPI(
          textInput,
          images,
          inputMode
        );
        setFeatures(generatedFeatures);

        // Auto-save the flow
        if (generatedFeatures.length > 0) {
          const flowName = generatedFeatures[0].name || `Flow ${new Date().toLocaleDateString()}`;
          saveFlow(generatedFeatures, flowName);
        }

        if (generatedFeatures.length > 0) {
          setActiveFeatureId(generatedFeatures[0].id);
        }
      } catch (err) {
        console.error('Generation error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to generate flows'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const deleteFeature = useCallback(
    (id: string) => {
      setFeatures((prev) => {
        const filtered = prev.filter((f) => f.id !== id);
        // Update active feature if we deleted the active one
        if (activeFeatureId === id && filtered.length > 0) {
          setActiveFeatureId(filtered[0].id);
        } else if (filtered.length === 0) {
          setActiveFeatureId(null);
        }
        return filtered;
      });
    },
    [activeFeatureId]
  );

  const clearFeatures = useCallback(() => {
    setFeatures([]);
    setActiveFeatureId(null);
    setError(null);
  }, []);

  const updateNode = useCallback(
    (featureId: string, nodeId: string, updates: { label?: string; details?: string[] }) => {
      setFeatures((prev) =>
        prev.map((feature) => {
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
        })
      );
    },
    []
  );

  const activeFeature = features.find((f) => f.id === activeFeatureId);

  return {
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
  };
};
