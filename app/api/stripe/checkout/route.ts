import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe - will be validated at runtime
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover',
    })
  : null as any; // Will fail at runtime if not set

export async function POST(request: NextRequest) {
  // Validate environment variables at runtime
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { priceId, successUrl, cancelUrl, customerEmail } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined, // Link subscription to user email
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/cancel`,
      metadata: {
        user_email: customerEmail || '',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

