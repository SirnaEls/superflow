/**
 * Usage tracking and limits
 */

import { PlanType, getPlanLimits } from './plans';

const GENERATIONS_KEY = 'flowforge-generations';
const GENERATION_MONTH_KEY = 'flowforge-generation-month';

interface GenerationRecord {
  date: string; // ISO date string
  count: number;
}

/**
 * Get current month key (YYYY-MM format)
 */
function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Get generation count for current month
 */
export function getCurrentMonthGenerations(): number {
  if (typeof window === 'undefined') return 0;
  
  const currentMonth = getCurrentMonthKey();
  const storedMonth = localStorage.getItem(GENERATION_MONTH_KEY);
  
  // If it's a new month, reset count
  if (storedMonth !== currentMonth) {
    localStorage.setItem(GENERATION_MONTH_KEY, currentMonth);
    localStorage.setItem(GENERATIONS_KEY, '0');
    return 0;
  }
  
  const count = localStorage.getItem(GENERATIONS_KEY);
  return count ? parseInt(count, 10) : 0;
}

/**
 * Increment generation count for current month
 */
export function incrementGenerationCount(): void {
  if (typeof window === 'undefined') return;
  
  const currentMonth = getCurrentMonthKey();
  const storedMonth = localStorage.getItem(GENERATION_MONTH_KEY);
  
  // Reset if new month
  if (storedMonth !== currentMonth) {
    localStorage.setItem(GENERATION_MONTH_KEY, currentMonth);
    localStorage.setItem(GENERATIONS_KEY, '1');
    return;
  }
  
  const currentCount = getCurrentMonthGenerations();
  localStorage.setItem(GENERATIONS_KEY, String(currentCount + 1));
}

/**
 * Check if user can generate more flows
 */
export function canGenerate(plan?: PlanType): { allowed: boolean; reason?: string } {
  const limits = getPlanLimits(plan);
  
  // Pro plan has unlimited generations
  if (limits.generationsPerMonth === -1) {
    return { allowed: true };
  }
  
  const currentCount = getCurrentMonthGenerations();
  
  if (currentCount >= limits.generationsPerMonth) {
    return {
      allowed: false,
      reason: `You've reached your monthly limit of ${limits.generationsPerMonth} generations. Upgrade to generate more flows.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Get remaining generations for current month
 */
export function getRemainingGenerations(plan?: PlanType): number {
  const limits = getPlanLimits(plan);
  
  if (limits.generationsPerMonth === -1) {
    return -1; // unlimited
  }
  
  const currentCount = getCurrentMonthGenerations();
  return Math.max(0, limits.generationsPerMonth - currentCount);
}

