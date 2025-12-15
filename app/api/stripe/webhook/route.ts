import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseServer } from '@/lib/supabase-server';

// Initialize Stripe - will be validated at runtime in the POST handler
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Create Stripe instance only if key is available (for build time)
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    })
  : null as any; // Will fail at runtime if not set

/**
 * Map Stripe price ID to plan type
 */
function getPlanTypeFromPriceId(priceId: string | null): 'free' | 'starter' | 'pro' {
  if (!priceId) return 'free';
  
  // You can check against environment variables or hardcode based on your Stripe setup
  const starterPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER;
  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;
  
  if (priceId === starterPriceId) return 'starter';
  if (priceId === proPriceId) return 'pro';
  
  // Fallback: try to infer from price amount or default to starter
  return 'starter';
}

/**
 * Map Stripe subscription status to our status
 */
function mapStripeStatus(stripeStatus: string): 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return stripeStatus as 'active' | 'trialing';
    case 'canceled':
    case 'unpaid':
    case 'past_due':
      return stripeStatus as 'canceled' | 'unpaid' | 'past_due';
    default:
      return 'active';
  }
}

/**
 * Update or create subscription in database
 */
async function upsertSubscription(
  userEmail: string,
  stripeCustomerId: string | null,
  stripeSubscriptionId: string,
  stripePriceId: string | null,
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing',
  currentPeriodStart: number | null,
  currentPeriodEnd: number | null,
  cancelAtPeriodEnd: boolean
) {
  const planType = getPlanTypeFromPriceId(stripePriceId);
  
  // Get user ID from email (try to find in next_auth.users or auth.users)
  let userId: string | null = null;
  
  // Try to find in next_auth.users first (most common case)
  const { data: nextAuthUser } = await supabaseServer
    .from('next_auth.users')
    .select('id')
    .eq('email', userEmail)
    .single();
  
  if (nextAuthUser?.id) {
    userId = nextAuthUser.id;
  } else {
    // Try to find in auth.users (Supabase Auth) - requires direct table access
    // Note: This might not work with service role, so we'll just use null if not found
    // The subscription will still work with just the email
    try {
      const { data: authUsers } = await supabaseServer
        .from('auth.users')
        .select('id')
        .eq('email', userEmail)
        .limit(1);
      
      if (authUsers && authUsers.length > 0) {
        userId = authUsers[0].id;
      }
    } catch (error) {
      // auth.users might not be accessible, that's okay
      console.log('Could not access auth.users, using email only');
    }
  }
  
  const subscriptionData = {
    user_id: userId,
    user_email: userEmail,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    stripe_price_id: stripePriceId,
    plan_type: planType,
    status: status,
    current_period_start: currentPeriodStart ? new Date(currentPeriodStart * 1000).toISOString() : null,
    current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    cancel_at_period_end: cancelAtPeriodEnd,
    updated_at: new Date().toISOString(),
  };
  
  // Upsert subscription
  const { error } = await supabaseServer
    .from('subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'stripe_subscription_id',
      ignoreDuplicates: false,
    });
  
  if (error) {
    console.error('Error upserting subscription:', error);
    throw error;
  }
  
  console.log(`Subscription ${stripeSubscriptionId} updated for user ${userEmail} with plan ${planType}`);
}

export async function POST(request: NextRequest) {
  // Validate environment variables at runtime
  if (!stripeSecretKey || !webhookSecret) {
    console.error('Missing Stripe environment variables');
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        // Get subscription details if available
        if (session.subscription && typeof session.subscription === 'string') {
          const subscriptionData = await stripe.subscriptions.retrieve(session.subscription);
          // Access properties directly with type assertion
          const subscription = subscriptionData as any;
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          const customerEmail = typeof customer === 'object' && !customer.deleted ? customer.email : session.customer_email;
          
          if (customerEmail) {
            await upsertSubscription(
              customerEmail,
              subscription.customer as string,
              subscription.id,
              subscription.items?.data?.[0]?.price?.id || null,
              mapStripeStatus(subscription.status),
              subscription.current_period_start ?? null,
              subscription.current_period_end ?? null,
              subscription.cancel_at_period_end ?? false
            );
          }
        }
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription: any = event.data.object;
        console.log('Subscription updated:', subscription.id);
        
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const customerEmail = typeof customer === 'object' && !customer.deleted ? customer.email : null;
        
        if (customerEmail) {
          await upsertSubscription(
            customerEmail,
            subscription.customer as string,
            subscription.id,
            subscription.items?.data?.[0]?.price?.id || null,
            mapStripeStatus(subscription.status),
            subscription.current_period_start ?? null,
            subscription.current_period_end ?? null,
            subscription.cancel_at_period_end ?? false
          );
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription: any = event.data.object;
        console.log('Subscription cancelled:', deletedSubscription.id);
        
        // Update subscription status to canceled
        const deletedCustomer = await stripe.customers.retrieve(deletedSubscription.customer as string);
        const deletedCustomerEmail = typeof deletedCustomer === 'object' && !deletedCustomer.deleted ? deletedCustomer.email : null;
        
        if (deletedCustomerEmail) {
          await upsertSubscription(
            deletedCustomerEmail,
            deletedSubscription.customer as string,
            deletedSubscription.id,
            deletedSubscription.items?.data?.[0]?.price?.id || null,
            'canceled',
            deletedSubscription.current_period_start ?? null,
            deletedSubscription.current_period_end ?? null,
            false
          );
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice paid:', invoice.id);
        // Subscription is already updated via customer.subscription.updated
        break;

      case 'invoice.payment_failed':
        const failedInvoice: any = event.data.object;
        console.log('Invoice payment failed:', failedInvoice.id);
        
        // Update subscription status if it's a subscription invoice
        if (failedInvoice.subscription && typeof failedInvoice.subscription === 'string') {
          const failedSubscriptionData = await stripe.subscriptions.retrieve(failedInvoice.subscription);
          // Access properties directly with type assertion
          const failedSubscription = failedSubscriptionData as any;
          const failedCustomer = await stripe.customers.retrieve(failedSubscription.customer as string);
          const failedCustomerEmail = typeof failedCustomer === 'object' && !failedCustomer.deleted ? failedCustomer.email : null;
          
          if (failedCustomerEmail) {
            await upsertSubscription(
              failedCustomerEmail,
              failedSubscription.customer as string,
              failedSubscription.id,
              failedSubscription.items?.data?.[0]?.price?.id || null,
              'past_due',
              failedSubscription.current_period_start ?? null,
              failedSubscription.current_period_end ?? null,
              failedSubscription.cancel_at_period_end ?? false
            );
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    // Don't return error to Stripe, just log it
  }

  return NextResponse.json({ received: true });
}

