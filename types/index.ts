// ============================================
// Node Types
// ============================================

export type NodeType =
  | 'besoin'           // Initial need (Purple cylinder) - mandatory start
  | 'besoin-valide'    // Validated need (Blue cylinder) - mandatory end
  | 'action'           // User action (Green rectangle)
  | 'information'     // Information/Details (Dark yellow rectangle)
  | 'description'      // Description with details (Light yellow rectangle)
  | 'pain-point'       // Friction point (Pink rectangle)
  | 'question';        // Pending question (Question mark icon)

export type NodeShape =
  | 'rounded-rect'
  | 'rect'
  | 'parallelogram'
  | 'cylinder'
  | 'diamond'
  | 'icon';

export type Priority = 'high' | 'medium' | 'low';

// ============================================
// Configuration Types
// ============================================

export interface NodeConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  shape: NodeShape;
}

// ============================================
// Flow Types
// ============================================

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  connectionLabel?: string;
  branch?: 'Yes' | 'No';
  details?: string[]; // For bullet lists in Description blocks
}

export interface UserFlow {
  nodes: FlowNode[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  flow: UserFlow;
}

// ============================================
// UI Types
// ============================================

export interface UploadedImage {
  id: string;
  name: string;
  data: string;
}

export type InputMode = 'text' | 'image';

// ============================================
// API Types
// ============================================

export interface ClaudeMessage {
  type: string;
  text?: string;
}

export interface ClaudeResponse {
  content: ClaudeMessage[];
  error?: {
    message: string;
  };
}
