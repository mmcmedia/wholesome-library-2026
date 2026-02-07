# Creem Payment Processor Setup

This guide walks you through setting up Creem as the payment processor for Wholesome Library v2.

## What is Creem?

Creem (creem.io) is a modern, developer-friendly SaaS payment processor. It's simpler than Stripe and has native features for:
- Subscriptions with trials
- Pause/Resume (native support — no workarounds needed)
- Customer billing portal
- Webhooks for all events

## Prerequisites

- Creem account: https://creem.io
- API access enabled
- (Optional) Webhook endpoint configured

## Step 1: Create Your Creem Account

1. Go to https://creem.io and sign up
2. Verify your email
3. Complete your business profile
4. Navigate to **Dashboard > API Keys**

## Step 2: Get Your API Key

1. In Creem Dashboard, go to **Settings > API Keys**
2. Click **Generate New Key**
3. Name it: `wholesome-library-prod` (or `wholesome-library-test` for test environment)
4. Copy the API key (format: `creem_XXXXX` or `creem_test_XXXXX`)
5. Add to `.env.local`:
   ```
   CREEM_API_KEY=creem_XXXXX
   CREEM_ENV=production
   ```

## Step 3: Create Products

Products in Creem define what users can subscribe to. You need two products:

### Monthly Plan: $7.99/month

1. Go to **Products** in Creem Dashboard
2. Click **Create Product**
3. Fill in:
   - **Name**: `Family Monthly Plan`
   - **Description**: `Unlimited access to all stories for the whole family. Cancel anytime.`
   - **Type**: Recurring (Subscription)
4. Click **Add Pricing**:
   - **Currency**: USD
   - **Amount**: $7.99
   - **Billing Interval**: Monthly
   - **Trial Period**: 7 days
5. Click **Create Product**
6. Copy the Product ID (format: `prod_XXXXX`)
7. Add to `.env.local`:
   ```
   CREEM_MONTHLY_PRODUCT_ID=prod_XXXXX
   ```

### Annual Plan: $59.99/year

1. Go to **Products** in Creem Dashboard
2. Click **Create Product**
3. Fill in:
   - **Name**: `Family Annual Plan`
   - **Description**: `Unlimited access to all stories for the whole family for a full year. Best value!`
   - **Type**: Recurring (Subscription)
4. Click **Add Pricing**:
   - **Currency**: USD
   - **Amount**: $59.99
   - **Billing Interval**: Yearly
   - **Trial Period**: 7 days
5. Click **Create Product**
6. Copy the Product ID
7. Add to `.env.local`:
   ```
   CREEM_ANNUAL_PRODUCT_ID=prod_XXXXX
   ```

## Step 4: Configure Webhooks (Optional but Recommended)

Webhooks allow Creem to notify your app of subscription events (checkout completed, subscription cancelled, etc.).

### Set Up Webhook Endpoint

1. Go to **Settings > Webhooks** in Creem Dashboard
2. Click **Add Endpoint**
3. Fill in:
   - **Endpoint URL**: `https://yourdomain.com/api/creem/webhook`
   - **Event Types**: Select all (or at minimum: `checkout.completed`, `subscription.active`, `subscription.cancelled`, `subscription.paused`)
4. Click **Create Endpoint**
5. Creem will display a webhook secret (format: `whsec_XXXXX`)
6. Add to `.env.local`:
   ```
   CREEM_WEBHOOK_SECRET=whsec_XXXXX
   ```

### Test Webhook Delivery

1. In Webhooks settings, find your endpoint
2. Click **Send Test Event**
3. Your app should receive the webhook at `/api/creem/webhook`
4. Check server logs to confirm successful processing

## Step 5: Update Environment Variables

Create or update `.env.local` with all variables:

```bash
# Creem Payment Processor
CREEM_API_KEY=creem_XXXXX
CREEM_ENV=production
CREEM_MONTHLY_PRODUCT_ID=prod_XXXXX
CREEM_ANNUAL_PRODUCT_ID=prod_XXXXX
CREEM_WEBHOOK_SECRET=whsec_XXXXX
```

## Step 6: Database Schema Update

The app's database schema includes Creem columns:
- `creem_customer_id` — Customer identifier from Creem
- `creem_subscription_id` — Subscription identifier from Creem

These are automatically populated when users complete checkout.

## Step 7: Test the Integration

### Local Testing

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `/subscription` page
3. Click **Start Free Trial** on either plan
4. You'll be redirected to Creem's hosted checkout
5. Use Creem's test card details (provided in test environment):
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
6. Complete the checkout
7. You should be redirected to `/subscription/success`
8. Check your database — the user's profile should now have:
   - `creem_customer_id` populated
   - `creem_subscription_id` populated
   - `subscription_status` = `'active'`
   - `plan` = `'family'` or `'annual'`

### Test Pause/Resume

1. Navigate to `/parent/pause`
2. Click **Pause Subscription**
3. Check user profile — `subscription_status` should be `'paused'`
4. The subscription is paused in Creem (no billing until resumed)

### Test Cancellation

1. Navigate to `/parent/cancel`
2. Select a cancellation reason
3. Confirm cancellation
4. Check user profile — `subscription_status` should be `'cancelled'`
5. User will receive cancellation confirmation email

## Step 8: Production Deployment

1. Set `CREEM_ENV=production` in your production `.env`
2. Use production API key (`creem_XXXXX`, not `creem_test_XXXXX`)
3. Use production product IDs (created in live environment)
4. Configure production webhook URL in Creem Dashboard
5. Test a real payment with a test card before going live
6. Monitor logs and webhook deliveries in Creem Dashboard

## API Reference

### Key Endpoints Used by App

**Create Checkout Session**
```
POST /v1/checkouts
Headers: x-api-key: creem_XXXXX
Body: {
  product_id: "prod_XXXXX",
  success_url: "https://yourdomain.com/subscription/success",
  customer_email: "user@example.com" (optional)
}
Response: { checkout_url: "https://checkout.creem.io/..." }
```

**Get Subscription**
```
GET /v1/subscriptions/{subscription_id}
Headers: x-api-key: creem_XXXXX
Response: {
  id: "sub_XXXXX",
  status: "active|paused|cancelled",
  customer_id: "cus_XXXXX",
  current_period_end: "2025-02-28T00:00:00Z"
}
```

**Pause Subscription**
```
POST /v1/subscriptions/{subscription_id}/pause
Headers: x-api-key: creem_XXXXX
Response: { id, status: "paused", ... }
```

**Resume Subscription**
```
POST /v1/subscriptions/{subscription_id}/resume
Headers: x-api-key: creem_XXXXX
Response: { id, status: "active", ... }
```

**Cancel Subscription**
```
POST /v1/subscriptions/{subscription_id}/cancel
Headers: x-api-key: creem_XXXXX
Response: { id, status: "cancelled", ... }
```

**Create Billing Portal**
```
POST /v1/customers/billing
Headers: x-api-key: creem_XXXXX
Body: { customer_id: "cus_XXXXX" }
Response: { portal_url: "https://portal.creem.io/..." }
```

For full API documentation, visit: https://docs.creem.io

## Troubleshooting

### "Missing API Key" Error
- Check `.env.local` has `CREEM_API_KEY` set
- Verify it's the correct key (should start with `creem_` or `creem_test_`)

### Checkout Page Not Loading
- Verify `CREEM_MONTHLY_PRODUCT_ID` and `CREEM_ANNUAL_PRODUCT_ID` are set
- Check that products are created and active in Creem Dashboard
- Confirm API key has access to these products

### Webhooks Not Arriving
- Go to Creem Dashboard > Settings > Webhooks
- Check the endpoint status (should be "Active")
- Click **Send Test Event** to verify connectivity
- Check server logs for incoming webhook requests

### "Subscription Not Found" on Cancel/Pause
- Verify `creem_subscription_id` is stored in user profile
- Check that the subscription exists in Creem Dashboard
- Make sure the API key has permission to access subscriptions

## Security Checklist

- ✅ API key stored in `.env.local` (never committed to git)
- ✅ Webhook secret configured and verified on incoming requests
- ✅ Subscriptions updated via server-side API calls (never from client)
- ✅ User IDs stored in webhook event metadata or database mapping
- ✅ All sensitive operations logged for audit trail
- ✅ Test environment used before production deployment

## Next Steps

1. Complete the steps above
2. Test the full flow (signup → subscription → pause/cancel)
3. Deploy to production
4. Monitor webhook delivery in Creem Dashboard
5. Monitor subscription churn and trial conversion metrics

---

**Questions?** Refer to Creem's full documentation: https://docs.creem.io/llms-full.txt
