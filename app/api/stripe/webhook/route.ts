import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
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
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // Handle successful checkout
      console.log('Checkout session completed:', session.id);
      // Here you would typically:
      // - Update user subscription status in your database
      // - Send confirmation email
      // - Grant access to premium features
      break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id);
      // Update subscription status in your database
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      console.log('Subscription cancelled:', deletedSubscription.id);
      // Revoke access to premium features
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoice.id);
      // Handle successful payment
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.log('Invoice payment failed:', failedInvoice.id);
      // Handle failed payment
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

