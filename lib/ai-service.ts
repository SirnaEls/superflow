import { Feature, ClaudeMessage, UploadedImage } from '@/types';
import { generateId } from './utils';

const SYSTEM_PROMPT = `You are a UX design assistant that converts FigJam post-it notes into structured user flows.

Analyze the input and identify distinct features/user stories. For each feature, generate a user flow with nodes and connections.

RESPOND ONLY WITH A VALID JSON ARRAY (no markdown, no backticks), using this exact structure:
[
  {
    "name": "Feature Name",
    "description": "Brief description of the feature",
    "priority": "high" | "medium" | "low",
    "flow": {
      "nodes": [
        { "id": "1", "type": "start", "label": "Start" },
        { "id": "2", "type": "process", "label": "User action", "connectionLabel": "" },
        { "id": "3", "type": "input", "label": "Enter data", "connectionLabel": "" },
        { "id": "4", "type": "decision", "label": "Condition?", "connectionLabel": "" },
        { "id": "5", "type": "success", "label": "Success outcome", "branch": "Yes" },
        { "id": "6", "type": "error", "label": "Error outcome", "branch": "No" }
      ]
    }
  }
]

Node types available:
- start: Beginning of flow (dark rounded rectangle)
- end: End of flow (dark rounded rectangle)  
- process: User action or system process (purple bordered rectangle)
- input: User input required (blue parallelogram)
- data: Database operation (yellow cylinder)
- decision: Yes/No decision point (green diamond)
- success: Positive outcome (purple rectangle)
- error: Negative/error outcome (purple rectangle)

Use "branch" property for nodes that come after a decision (values: "Yes" or "No").
Use "connectionLabel" for labels on arrows between nodes.

Be thorough and create realistic, detailed user flows based on the post-it content.`;

interface GenerateFlowsParams {
  textInput?: string;
  images?: UploadedImage[];
}

export async function generateFlows({ textInput, images }: GenerateFlowsParams): Promise<Feature[]> {
  const content: Array<{ type: string; text?: string; source?: { type: string; data: string; mime_type: string } }> = [];

  // Build content based on input type
  if (textInput?.trim()) {
    content.push({
      type: 'text',
      text: `Analyze these FigJam post-it notes and generate user flows:\n\n${textInput}`,
    });
  }

  if (images && images.length > 0) {
    content.push({
      type: 'text',
      text: 'Analyze these FigJam post-it note screenshots and generate user flows for each feature identified:',
    });

    images.forEach((img) => {
      if (!img.data) {
        console.warn('Image data is missing, skipping image:', img.name);
        return;
      }

      // Handle data URL format: data:image/png;base64,<data>
      const parts = img.data.split(',');
      if (parts.length < 2) {
        console.warn('Invalid image data format, skipping image:', img.name);
        return;
      }

      const base64Data = parts[1];
      const metaPart = parts[0];
      
      // Extract media type from metadata (e.g., "data:image/png;base64" -> "image/png")
      const metaParts = metaPart.split(';');
      const typePart = metaParts[0];
      const typeParts = typePart.split(':');
      
      if (typeParts.length < 2) {
        console.warn('Invalid image metadata format, skipping image:', img.name);
        return;
      }

      const mediaType = typeParts[1] || 'image/png'; // Default to png if not found
      
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          mime_type: mediaType,
          data: base64Data,
        },
      });
    });
  }

  if (content.length === 0) {
    throw new Error('Please add some content to analyze');
  }

  // Call Claude API
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add API key header if available (for local development)
  if (apiKey) {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'API error occurred');
  }

  // Extract text from response
  const responseText = data.content
    .filter((item: { type: string }) => item.type === 'text')
    .map((item: { text: string }) => item.text)
    .join('');

  // Parse JSON response
  const cleanJson = responseText.replace(/```json|```/g, '').trim();
  const parsedFeatures = JSON.parse(cleanJson);

  // Add unique IDs to features
  return parsedFeatures.map((feature: Omit<Feature, 'id'>, index: number) => ({
    ...feature,
    id: `feature-${generateId()}-${index}`,
  }));
}
