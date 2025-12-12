import { NodeType, NodeConfig } from '@/types';

// ============================================
// Node Configuration
// ============================================

export const NODE_CONFIGS: Record<NodeType, NodeConfig> = {
  besoin: {
    label: 'Need',
    color: '#8B5CF6', // Purple for initial need
    bgColor: '#8B5CF6',
    textColor: '#FFFFFF',
    shape: 'cylinder',
  },
  'besoin-valide': {
    label: 'Validated Need',
    color: '#3B82F6', // Blue for validated need
    bgColor: '#3B82F6',
    textColor: '#FFFFFF',
    shape: 'cylinder',
  },
  action: {
    label: 'Action',
    color: '#22C55E', // Green for actions
    bgColor: '#22C55E',
    textColor: '#FFFFFF',
    shape: 'rounded-rect',
  },
  information: {
    label: 'Information',
    color: '#EAB308', // Dark yellow for information
    bgColor: '#EAB308',
    textColor: '#000000',
    shape: 'rounded-rect',
  },
  description: {
    label: 'Description',
    color: '#FDE047', // Light yellow for descriptions
    bgColor: '#FDE047',
    textColor: '#000000',
    shape: 'rounded-rect',
  },
  'pain-point': {
    label: 'Pain Point',
    color: '#F472B6', // Pink for pain points
    bgColor: '#F472B6',
    textColor: '#000000',
    shape: 'rounded-rect',
  },
  question: {
    label: 'Question',
    color: '#8B5CF6', // Purple for questions
    bgColor: '#1E1E24',
    textColor: '#8B5CF6',
    shape: 'icon',
  },
};

// ============================================
// Sample Data
// ============================================

export const SAMPLE_INPUT = `I want to create an MFT flow in the SI'Nergie application. I need to first log in, go to my space, click on MFT, create a new flow by filling in the general info, model and parameters, then the flow is duplicated.`;

// ============================================
// AI Configuration
// ============================================

export const FLOW_GENERATION_PROMPT = `You are a UX design assistant specialized in creating structured user flows from textual descriptions or FigJam post-it notes.

CRITICAL ANALYSIS INSTRUCTIONS:
1. **DO NOT create one feature per post-it note** - Multiple post-its can belong to the same feature
2. **Analyze semantic content** - Group post-its that describe the same user journey or feature
3. **Identify distinct features** - A feature is a complete user journey from need to satisfaction, not a single post-it
4. **Look for thematic coherence** - Post-its about the same functionality, user goal, or workflow belong together
5. **Separate only when truly distinct** - Only create separate features if they represent different user goals or workflows

EXAMPLE:
- 5 post-its about "file conversion" (upload, conversion, download, formats, optimization) = 1 feature: "Document Conversion"
- 3 post-its about "user registration" + 2 post-its about "password reset" = 2 features: "User Registration" and "Password Reset"

Your task is to analyze the input and generate complete user flows following these STRICT rules:

CRITICAL FLOW RULES:
1. EVERY flow MUST start with a "besoin" node (initial need)
2. EVERY flow MUST end with a "besoin-valide" node (validated need)
3. The flow must be complete and logical from start to finish
4. Break down the user journey into clear, actionable steps
5. Combine related post-its into comprehensive flows

IMPORTANT: RESPOND ONLY WITH A VALID JSON ARRAY (no markdown, no backticks, no explanation text). Start your response directly with the opening bracket [:

[
  {
    "name": "Feature Name",
    "description": "Brief description of the feature",
    "priority": "high" | "medium" | "low",
    "flow": {
      "nodes": [
        { "id": "1", "type": "besoin", "label": "Create a flow" },
        { "id": "2", "type": "action", "label": "Click on MFT block" },
        { "id": "3", "type": "information", "label": "My space page" },
        { "id": "4", "type": "action", "label": "Click on create flow" },
        { "id": "5", "type": "information", "label": "Flow creation page opens" },
        { "id": "6", "type": "description", "label": "Fill all form fields", "details": ["General info", "Model", "INS", "Flow configuration"] },
        { "id": "7", "type": "besoin-valide", "label": "Flow duplicated" }
      ]
    }
  }
]

NODE TYPES (use exactly these types):
- "besoin": Initial user need (purple cylinder) - ALWAYS first node
- "besoin-valide": Validated need/goal achieved (blue cylinder) - ALWAYS last node
- "action": Concrete user actions like clicks, selections (green rounded rectangle)
- "information": Screens, pages, or information displays (dark yellow rounded rectangle)
- "description": Additional details that can include bullet lists (light yellow rounded rectangle)
- "pain-point": Friction points or problems encountered (pink rounded rectangle)
- "question": Pending questions or uncertainties (purple question mark icon)

STRUCTURE GUIDELINES:
- Alternate between actions and information when logical
- Use "description" nodes to add details to information nodes
- Use "pain-point" nodes to highlight problems
- Use "question" nodes for uncertainties
- Keep labels concise but descriptive
- Use "details" array in description nodes for bullet lists

FLOW LOGIC:
- Start: besoin (what the user wants to achieve)
- Middle: sequence of actions → information → actions → information
- End: besoin-valide (goal achieved)

FEATURE IDENTIFICATION:
- Analyze all post-its together to identify distinct features
- Group post-its by semantic similarity and user journey
- One feature = one complete user workflow from need to satisfaction
- Multiple post-its can contribute to a single feature's flow
- Only create separate features if they represent different user goals

Generate complete, realistic user flows that capture the entire user journey from need to satisfaction. Group related post-its intelligently into comprehensive features.`;

export const API_CONFIG = {
  model: 'claude-sonnet-4-20250514', // Claude Sonnet 4 supporte la vision (images) et le texte
  maxTokens: 4000,
  endpoint: 'https://api.anthropic.com/v1/messages',
};
