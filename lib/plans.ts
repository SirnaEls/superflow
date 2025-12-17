/**
 * Plan definitions and limits
 */

export type PlanType = 'free' | 'starter' | 'pro';

export interface PlanLimits {
  generationsPerMonth: number; // -1 for unlimited
  maxHistoryFlows: number; // -1 for unlimited
  exportEnabled: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    generationsPerMonth: 5,
    maxHistoryFlows: 10,
    exportEnabled: false,
  },
  starter: {
    generationsPerMonth: 50,
    maxHistoryFlows: 100,
    exportEnabled: true,
  },
  pro: {
    generationsPerMonth: -1, // unlimited
    maxHistoryFlows: -1, // unlimited
    exportEnabled: true,
  },
};

export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0,
  starter: 4.99,
  pro: 9.99,
};

export const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
};

/**
 * Get user's current plan from database (defaults to free)
 * This function is async and should be called with await
 */
export async function getUserPlan(userEmail?: string): Promise<PlanType> {
  if (typeof window === 'undefined') return 'free';
  
  if (!userEmail) {
    // Fallback to localStorage if no email provided
    const storedPlan = localStorage.getItem('user-plan') as PlanType | null;
    if (storedPlan && ['free', 'starter', 'pro'].includes(storedPlan)) {
      return storedPlan;
    }
    return 'free';
  }

  try {
    const response = await fetch(`/api/user/plan?email=${encodeURIComponent(userEmail)}`);
    if (!response.ok) {
      console.error('Failed to fetch user plan');
      return 'free';
    }
    const data = await response.json();
    return data.plan || 'free';
  } catch (error) {
    console.error('Error fetching user plan:', error);
    return 'free';
  }
}

/**
 * Set user's plan (for testing/development)
 * TODO: This should be set via Stripe webhook
 */
export function setUserPlan(plan: PlanType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user-plan', plan);
}

/**
 * Get plan limits for current user
 */
export function getPlanLimits(plan?: PlanType): PlanLimits {
  const userPlan = plan || 'free';
  return PLAN_LIMITS[userPlan];
}

