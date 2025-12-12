import { Feature } from '@/types';

export interface SavedFlow {
  id: string;
  name: string;
  features: Feature[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'flowforge-flows';

export function saveFlow(features: Feature[], name?: string): SavedFlow {
  const flow: SavedFlow = {
    id: `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name || `Flow ${new Date().toLocaleDateString()}`,
    features,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const existing = getFlows();
  existing.unshift(flow);
  // Keep only last 50 flows
  const limited = existing.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  
  return flow;
}

export function getFlows(): SavedFlow[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getFlow(id: string): SavedFlow | null {
  const flows = getFlows();
  return flows.find(f => f.id === id) || null;
}

export function deleteFlow(id: string): void {
  const flows = getFlows();
  const filtered = flows.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateFlow(id: string, updates: Partial<SavedFlow>): void {
  const flows = getFlows();
  const index = flows.findIndex(f => f.id === id);
  if (index !== -1) {
    flows[index] = {
      ...flows[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flows));
  }
}


