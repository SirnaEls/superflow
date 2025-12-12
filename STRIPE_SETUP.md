# Stripe Integration Setup

This guide will help you set up Stripe payments in FlowForge.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to your Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
   - Use test keys for development (start with `pk_test_` and `sk_test_`)
   - Use live keys for production (start with `pk_live_` and `sk_live_`)

## Step 2: Create a Product and Price

1. In Stripe Dashboard, go to **Products**
2. Click **Add product**
3. Fill in product details:
   - Name: e.g., "FlowForge Pro"
   - Description: Your subscription description
4. Add a price:
   - Choose **Recurring** for subscriptions
   - Set billing period (monthly/yearly)
   - Set price amount
5. Copy the **Price ID** (starts with `price_`)

## Step 3: Set Up Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL:
   - Development: `http://localhost:3002/api/stripe/webhook` (use Stripe CLI)
   - Production: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## Step 4: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price ID (from Step 2)
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## Step 5: Test Webhook Locally (Development)

For local development, use Stripe CLI:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3002/api/stripe/webhook`
4. Copy the webhook signing secret from the CLI output

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Click the "Upgrade" button in the header
3. Use Stripe test card: `4242 4242 4242 4242`
4. Use any future expiry date and any CVC
5. Complete the checkout flow

## Production Deployment

1. Switch to live API keys in your production environment
2. Update webhook endpoint URL in Stripe Dashboard
3. Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Test with real payment methods (use small amounts first)

## Files Created

- `app/api/stripe/checkout/route.ts` - Creates checkout sessions
- `app/api/stripe/webhook/route.ts` - Handles Stripe webhooks
- `lib/stripe.ts` - Client-side Stripe utilities
- `components/payment/checkout-button.tsx` - Checkout button component
- `app/success/page.tsx` - Success page after payment
- `app/cancel/page.tsx` - Cancellation page

## Next Steps

- Implement user authentication to track subscriptions
- Store subscription status in a database
- Add subscription management UI
- Implement feature gating based on subscription status

