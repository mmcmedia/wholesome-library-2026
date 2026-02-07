# Stripe Integration Setup Guide

## Overview

Wholesome Library uses Stripe for payment processing with two subscription plans:
- **Family Monthly:** $7.99/month
- **Family Annual:** $59.99/year (save 37%)

Both plans include a **7-day free trial** with no credit card required.

## Setup Steps

### 1. Create Stripe Account

1. Sign up at https://stripe.com
2. Complete business verification (for production)
3. Get your API keys from the dashboard

### 2. Create Products & Prices in Stripe Dashboard

#### Family Monthly Plan
1. Go to **Products** → **Add Product**
2. Name: `Family Monthly`
3. Description: `Unlimited access to Wholesome Library for the whole family`
4. Pricing:
   - Type: Recurring
   - Price: $7.99 USD
   - Billing period: Monthly
   - Free trial: 7 days
5. Save and copy the **Price ID** (starts with `price_`)

#### Family Annual Plan
1. Go to **Products** → **Add Product**
2. Name: `Family Annual`
3. Description: `Unlimited access to Wholesome Library for the whole family (annual)`
4. Pricing:
   - Type: Recurring
   - Price: $59.99 USD
   - Billing period: Yearly
   - Free trial: 7 days
5. Save and copy the **Price ID** (starts with `price_`)

### 3. Configure Environment Variables

Add to `.env.local`:

```bash
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx  # Use pk_live_ in production
STRIPE_SECRET_KEY=sk_test_xxxxx                   # Use sk_live_ in production

# Price IDs (from step 2)
STRIPE_PRICE_MONTHLY=price_xxxxx
STRIPE_PRICE_ANNUAL=price_xxxxx

# Webhook Secret (from step 4)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 4. Set Up Webhooks

#### Development (using Stripe CLI)

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy the webhook signing secret (starts with `whsec_`) to `.env.local`

#### Production

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. URL: `https://wholesomelibrary.com/api/stripe/webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Save and copy the **Signing secret** to production environment variables

### 5. Create Promotion Codes (Optional)

For win-back campaigns (50% off):

1. Go to **Products** → **Coupons**
2. Create coupon:
   - Name: `WINBACK50`
   - Type: Percentage
   - Discount: 50%
   - Duration: Once
3. Create promotion code: `WINBACK50`
4. Link to coupon
5. Use in win-back emails: `?promo=WINBACK50`

## Database Migration

Run the subscription fields migration:

```bash
npx drizzle-kit push
```

Or manually run:
```sql
-- See supabase/migrations/002_add_subscription_fields.sql
```

## API Routes

### `/api/stripe/checkout`
**POST** - Create a checkout session
```typescript
fetch('/api/stripe/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ plan: 'monthly' }) // or 'annual'
})
```

Returns: `{ url: string, sessionId: string }`

Redirect user to `url` to complete checkout.

### `/api/stripe/webhook`
**POST** - Stripe webhook handler (Stripe calls this, not you)

Handles events:
- `checkout.session.completed` → Activate subscription
- `customer.subscription.updated` → Update subscription status
- `customer.subscription.deleted` → Cancel subscription
- `invoice.payment_succeeded` → Log payment
- `invoice.payment_failed` → Mark subscription past_due

## Subscription Page

Users can subscribe at `/subscription`:
- Shows pricing cards for monthly and annual plans
- "Start Free Trial" buttons create checkout sessions
- Redirects to Stripe Checkout
- Returns to `/subscription/success` after payment

## Managing Subscriptions

Users manage their subscription via Stripe Customer Portal:

```typescript
import { createBillingPortalSession } from '@/lib/stripe';

const { url } = await createBillingPortalSession({
  customerId: user.stripe_customer_id,
  returnUrl: 'https://wholesomelibrary.com/subscription',
});

// Redirect user to url
```

Portal allows users to:
- Update payment method
- Cancel subscription
- View invoices
- Download receipts

## Testing

### Test Mode Cards

Use these test cards in development:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires 3D Secure:** `4000 0025 0000 3155`

Any future expiry date and any 3-digit CVC works.

### Test Webhooks

Trigger test events:
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.deleted
```

## Subscription Flow

1. User clicks "Start Free Trial" on `/subscription`
2. API creates Stripe Checkout session with 7-day trial
3. User redirects to Stripe, enters payment details
4. Stripe redirects back to `/subscription/success`
5. Webhook `checkout.session.completed` fires
6. Webhook updates `profiles` table:
   - `plan` → 'family' or 'annual'
   - `stripe_customer_id` → customer ID
   - `stripe_subscription_id` → subscription ID
   - `subscription_status` → 'active'
   - `trial_ends_at` → null (trial consumed)
7. User has access to full library

## Cancellation Flow

1. User clicks "Manage Subscription" → redirects to Stripe Portal
2. User clicks "Cancel subscription"
3. Stripe sets `cancel_at_period_end: true`
4. Webhook `customer.subscription.updated` fires
5. Webhook updates `profiles.cancel_at_period_end` → true
6. User keeps access until `subscription_period_end`
7. At period end, webhook `customer.subscription.deleted` fires
8. Webhook updates:
   - `plan` → 'free'
   - `subscription_status` → 'cancelled'
   - `stripe_subscription_id` → null

## Monitoring

### Stripe Dashboard

Monitor in real-time:
- **Payments** → Recent charges
- **Subscriptions** → Active, cancelled, past due
- **Events** → Webhook delivery status
- **Customers** → Search by email

### Failed Webhooks

If webhooks fail:
1. Go to **Developers** → **Webhooks**
2. Click your webhook endpoint
3. View **Recent deliveries**
4. Click failed events to see error details
5. Click **Resend** to retry

## Production Checklist

Before going live:

- [ ] Switch to live API keys (pk_live_, sk_live_)
- [ ] Update webhook endpoint URL in Stripe Dashboard
- [ ] Update STRIPE_WEBHOOK_SECRET with production secret
- [ ] Test full checkout flow in production
- [ ] Test webhook delivery in production
- [ ] Enable Stripe Radar for fraud prevention
- [ ] Set up email receipts in Stripe settings
- [ ] Configure tax settings (if applicable)
- [ ] Review subscription settings (retry logic, dunning)

## Security

- ✅ Never expose `STRIPE_SECRET_KEY` client-side
- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Validate user authentication before creating checkout sessions
- ✅ Store minimal customer data (Stripe stores payment details)

## Support

- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test Mode Dashboard: https://dashboard.stripe.com/test/dashboard
- Live Mode Dashboard: https://dashboard.stripe.com/dashboard
