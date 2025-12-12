import { Feature, UploadedImage, InputMode } from '@/types';
import { API_CONFIG, FLOW_GENERATION_PROMPT } from './constants';

// ============================================
// General Utilities
// ============================================

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Classnames utility (simple version of clsx)
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// ============================================
// File Utilities
// ============================================

/**
 * Parse image file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Extract base64 data and media type from data URL
 */
export const parseDataUrl = (dataUrl: string): { base64: string; mediaType: string } => {
  if (!dataUrl) {
    throw new Error('Data URL is required');
  }

  const parts = dataUrl.split(',');
  if (parts.length < 2) {
    throw new Error('Invalid data URL format');
  }

  const [meta, base64] = parts;
  if (!meta || !base64) {
    throw new Error('Invalid data URL format: missing metadata or data');
  }

  const metaParts = meta.split(';');
  const typePart = metaParts[0];
  const typeParts = typePart.split(':');
  
  if (typeParts.length < 2) {
    throw new Error('Invalid data URL format: missing media type');
  }

  const mediaType = typeParts[1] || 'image/png';
  return { base64, mediaType };
};

// ============================================
// API Utilities
// ============================================

/**
 * Build API request content from text input (Claude format)
 */
const buildTextContent = (text: string) => {
  return `Analyze the following FigJam post-it notes. IMPORTANT: Multiple post-its can belong to the same feature. Group post-its by semantic content and user journey, not by individual post-it. Identify distinct features based on complete user workflows, not individual notes.

Post-it notes:
${text}

Instructions:
- Analyze the semantic content of each post-it
- Group post-its that describe the same feature or user journey
- Create one feature per distinct user goal/workflow, not per post-it
- Combine related post-its into comprehensive flows`;
};

/**
 * Build API request content from images (Claude format)
 */
const buildImageContent = (images: UploadedImage[]) => {
  const content: Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> = [
    {
      type: 'text',
      text: `Analyze these FigJam post-it note screenshots. CRITICAL: Multiple post-its can belong to the same feature. 

Instructions:
- Analyze the semantic content of each post-it note in the images
- Group post-its that describe the same feature or user journey together
- Create one feature per distinct user goal/workflow, NOT per post-it
- Look for thematic coherence: post-its about the same functionality belong together
- Only separate into different features if they represent truly distinct user goals or workflows

Example: If you see 5 post-its about "file conversion" (upload, conversion, download, formats, optimization), group them into 1 feature: "Document Conversion", not 5 separate features.

Generate user flows by grouping related post-its into comprehensive features:`,
    },
  ];

  images.forEach((img) => {
    // Claude utilise le format base64 avec media_type
    const base64Data = img.data.split(',')[1];
    const mediaType = img.data.split(';')[0].split(':')[1];
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data: base64Data,
      },
    });
  });

  return content;
};

/**
 * Call Next.js API route to generate flows (which calls Claude API server-side)
 */
export const generateFlowsFromAPI = async (
  textInput: string,
  images: UploadedImage[],
  inputMode: InputMode
): Promise<Feature[]> => {
  // Call our Next.js API route instead of Claude directly (avoids CORS)
  const response = await fetch('/api/generate-flows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      textInput,
      images,
      inputMode,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.statusText}`);
  }

  const data = await response.json();
  const parsedFeatures = data.features || [];
  
  if (!Array.isArray(parsedFeatures) || parsedFeatures.length === 0) {
    throw new Error('Invalid response format: expected a JSON array of features');
  }

  // Validate and fix flows
  const validatedFeatures = parsedFeatures.map((f: Omit<Feature, 'id'>, i: number) => {
    const flow = f.flow;
    if (!flow || !flow.nodes || flow.nodes.length === 0) {
      return { ...f, id: `feature-${generateId()}-${i}`, flow: { nodes: [] } };
    }

    const nodes = flow.nodes;
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];

    // Ensure flow starts with "besoin"
    if (!firstNode || firstNode.type !== 'besoin') {
      nodes.unshift({
        id: `node-${generateId()}-start`,
        type: 'besoin',
        label: f.name || 'Initial Need',
      });
    }

    // Ensure flow ends with "besoin-valide"
    if (!lastNode || lastNode.type !== 'besoin-valide') {
      nodes.push({
        id: `node-${generateId()}-end`,
        type: 'besoin-valide',
        label: 'Validated Need',
      });
    }

    return {
      ...f,
      id: `feature-${generateId()}-${i}`,
      flow: { nodes },
    };
  });

  return validatedFeatures;
};

// ============================================
// Style Utilities
// ============================================

/**
 * Get priority badge styles
 */
export const getPriorityStyles = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-amber-100 text-amber-700';
    case 'low':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};
