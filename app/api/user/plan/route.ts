import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { PlanType } from '@/lib/plans';

/**
 * GET /api/user/plan
 * Get user's current plan from database
 */
export async function GET(request: NextRequest) {
  try {
    // Get user email from query params or headers
    const email = request.nextUrl.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get subscription from database
    const { data: subscription, error } = await supabaseServer
      .from('subscriptions')
      .select('plan_type, status')
      .eq('user_email', email)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    // If no active subscription found, return free plan
    const plan: PlanType = subscription?.plan_type || 'free';

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error in /api/user/plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

