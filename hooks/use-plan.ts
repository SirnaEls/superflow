'use client';

import { useState, useEffect } from 'react';
import { PlanType, getUserPlan, getPlanLimits, PLAN_LIMITS } from '@/lib/plans';
import { getCurrentMonthGenerations, getRemainingGenerations } from '@/lib/usage';
import { useAuth } from '@/hooks/useAuth';

interface UsePlanReturn {
  plan: PlanType;
  limits: typeof PLAN_LIMITS[PlanType];
  currentGenerations: number;
  remainingGenerations: number;
  canGenerate: boolean;
}

/**
 * Hook to get user's plan and usage information
 */
export function usePlan(): UsePlanReturn {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>('free');
  const [currentGenerations, setCurrentGenerations] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      
      // Get plan from database if user is logged in
      if (user?.email) {
        const userPlan = await getUserPlan(user.email);
        setPlan(userPlan);
      } else {
        // Fallback to localStorage for non-authenticated users
        const storedPlan = localStorage.getItem('user-plan') as PlanType | null;
        if (storedPlan && ['free', 'starter', 'pro'].includes(storedPlan)) {
          setPlan(storedPlan);
        } else {
          setPlan('free');
        }
      }
      
      // Get current month generations
      setCurrentGenerations(getCurrentMonthGenerations());
      setLoading(false);
    };

    fetchPlan();
    
    // Listen for plan changes (e.g., from Stripe webhook)
    const handleStorageChange = () => {
      fetchPlan();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (in case of same-tab updates or webhook updates)
    const interval = setInterval(() => {
      fetchPlan();
    }, 10000); // Check every 10 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user?.email]);

  const limits = getPlanLimits(plan);
  const remainingGenerations = getRemainingGenerations(plan);
  const canGenerate = limits.generationsPerMonth === -1 || remainingGenerations > 0;

  return {
    plan,
    limits,
    currentGenerations,
    remainingGenerations,
    canGenerate,
  };
}

