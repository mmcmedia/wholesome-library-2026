# Retention System Documentation

## Overview

The Wholesome Library retention system includes subscription management, cancellation flows, win-back sequences, and daily automated checks. This document covers all retention-related features.

## Components

### 1. Core Retention Logic (`lib/retention.ts`)

Core functions for retention management:

#### `getRetentionMetrics(userId)`
Returns metrics displayed on cancellation page:
- Total stories read
- Total reading time (minutes)
- Current reading streak (days)
- Number of children
- Most recently read story

**Usage:**
```typescript
const metrics = await getRetentionMetrics(userId)
// Returns: { totalStoriesRead: 12, totalMinutesRead: 240, readingStreak: 5, ... }
```

#### `pauseSubscription(userId, durationDays)`
Pauses a subscription for specified duration (default: 30 days).
- Updates subscription status to "paused"
- Sets Stripe subscription metadata with resume date
- No charges during pause period
- Auto-resumes after pause period

**Usage:**
```typescript
const result = await pauseSubscription(userId, 30)
if (result.success) {
  console.log('Resume date:', result.resumeDate)
}
```

#### `resumeSubscription(userId)`
Resumes a paused subscription.
- Changes status from "paused" to "active"
- Cancels the scheduled cancellation in Stripe
- Clears pause metadata

#### `cancelSubscription(userId, reasons?, otherReason?)`
Fully cancels subscription at period end.
- Sets `cancel_at_period_end: true` in Stripe
- Logs cancellation reasons for analytics
- Sends confirmation email
- Returns subscription end date

**Usage:**
```typescript
const result = await cancelSubscription(
  userId,
  ['Too expensive', 'Not enough stories'],
  'We found another app'
)
if (result.success) {
  console.log('Access ends:', result.endDate)
}
```

#### `logCancelReason(userId, reasons[], otherReason?)`
Records why user cancelled for analytics and product improvement.
- Stores in database for analytics queries
- Helps identify product gaps and pricing issues

#### `getSubscriptionStatus(userId)`
Retrieves current subscription details:
- Current plan
- Status (active, paused, cancelled, etc.)
- Period end date
- Trial end date
- Cancel at period end flag

### 2. Cancellation Flow (`app/parent/cancel/page.tsx`)

Three-step cancellation process:

**Step 1: Value Reminder**
- Shows reading metrics (stories read, hours spent, streak, etc.)
- Empathetic messaging
- Option to pause instead of cancel

**Step 2: Reason Survey**
- Required checkboxes: Too expensive, Not enough stories, Child lost interest, Found alternative, Technical issues, Other
- Optional text input for custom reasons
- Used for product analytics

**Step 3: Confirmation**
- Final confirmation with access end date
- "Keep My Subscription" button (prominent)
- "Confirm Cancellation" (small text link)

**Features:**
- Warm, empathetic copy
- Shows what they'll miss (reading progress, etc.)
- Clear information about end date
- Option to go back at any stage
- Sends confirmation email

**Styling:**
- Uses teal (#135C5E) brand color
- Gradient background (teal/5 to white)
- Cards with subtle shadows
- Mobile responsive

### 3. Pause Subscription Page (`app/parent/pause/page.tsx`)

One-step pause flow:

**Features:**
- Shows what they'll miss (estimated new stories)
- Clear messaging about what happens during pause
- Auto-resume information
- Safety assurances (progress saved, etc.)
- Option to keep reading instead

**Styling:**
- Same brand colors as cancellation
- Visual indicators (new story count, auto-resume date)
- Prominent "Pause for 1 Month" button

### 4. Cancellation Confirmation (`app/parent/cancel-confirmation/page.tsx`)

Post-cancellation confirmation page:

**Features:**
- Celebration of their reading journey
- Clear details (end date, what happens next)
- Win-back messaging
- Resubscription link (prominent)
- Email support link
- No pressure to resubscribe

**Displays:**
- Confirmation that email was sent
- What happens after access ends
- Things to know (improvements coming, can pause instead, welcome back)
- 30-day win-back offer teaser

### 5. Daily Retention Checks (`app/api/retention/check/route.ts`)

Automated cron endpoint for retention triggers.

**Endpoint:** `GET /api/retention/check?apiKey=<CRON_SECRET>`

**Also accepts POST** with custom check selection:
```bash
curl -X POST http://localhost:3000/api/retention/check \
  -H "x-api-key: your-cron-secret" \
  -H "Content-Type: application/json" \
  -d '{"checks": ["trial", "inactivity", "winback"]}'
```

**Checks performed:**

1. **Trial Ending** (2 days before expiration)
   - Identifies users whose trial ends in 2-3 days
   - Sends "Your trial ends in 2 days" email
   - Includes reading metrics for motivation

2. **Inactivity** (7+ days no reading)
   - Finds children with no activity in 7 days
   - Sends re-engagement email with story recommendation
   - Includes favorite genre for personalization

3. **Win-Back** (30 days post-cancel)
   - Identifies users cancelled 30 days ago
   - Sends "We've added X new stories" email
   - Offers 50% off first month

**Setup Instructions:**

1. **Set CRON_SECRET** in `.env`:
   ```bash
   CRON_SECRET=your-random-secret-key-here
   ```

2. **Schedule daily calls** (e.g., via n8n, cron-job.org, or Vercel Cron):
   ```bash
   # Daily at 2 AM UTC
   curl "https://wholesomelibrary.com/api/retention/check?apiKey=<CRON_SECRET>"
   ```

3. **Test manually:**
   ```bash
   # Single check
   curl "http://localhost:3000/api/retention/check?apiKey=dev-secret-key"
   
   # Specific checks
   curl -X POST http://localhost:3000/api/retention/check \
     -H "x-api-key: dev-secret-key" \
     -d '{"checks": ["trial"]}'
   ```

**Response format:**
```json
{
  "success": true,
  "message": "Retention checks completed",
  "results": {
    "trialEnding": { "status": "completed" },
    "inactivity": { "status": "completed" },
    "winBack": { "status": "completed" }
  },
  "timestamp": "2026-02-07T10:00:00Z"
}
```

### 6. Parent Dashboard Updates

The parent dashboard now includes a "Manage Subscription" section with:

- **Take a Break** — Links to pause page
- **Billing Portal** — Stripe customer portal (change payment method, view invoices)
- **Cancel Subscription** — Links to cancel page

All links are in the Account tab under "Manage Subscription"

## Database Schema

Required tables (already in `lib/db/schema.ts`):

```sql
profiles
├── id (uuid, primary key)
├── email
├── plan (enum: free, family, annual)
├── stripeCustomerId
├── stripeSubscriptionId
├── subscriptionStatus (active, paused, cancelled, etc.)
├── subscriptionPeriodEnd (timestamp)
├── cancelAtPeriodEnd (boolean)
├── trialEndsAt (timestamp)
└── updatedAt

children
├── id (uuid)
├── parentId (references profiles)
├── name
├── readingLevel
└── ...

readingProgress
├── childId
├── storyId
├── completed (boolean)
├── completedAt (timestamp)
├── lastReadAt (timestamp)
└── ...

stories
├── id
├── publishedAt (timestamp)
└── ...
```

## Email Templates Used

The retention system uses pre-built email templates (do NOT modify):

1. **Trial Ending** (`emails/trial-ending`) — Sends 2 days before trial expiration
2. **Re-engagement** (`emails/re-engagement`) — Sends after 7 days inactivity
3. **Win-Back** (`emails/win-back`) — Sends 30 days post-cancel
4. **Cancellation** (`emails/cancellation`) — Sends on cancellation confirmation

All emails are sent via Resend using `lib/email.ts` helpers:
- `sendTrialEndingEmail()`
- `sendReEngagementEmail()`
- `sendWinBackEmail()`
- `sendCancellationEmail()`

## Analytics & Tracking

The cancellation flow tracks:
- Cancellation reasons (saved for product analysis)
- Completion of each step
- Time spent on each page
- Whether users pause instead of cancel

Use these for:
- Product roadmap decisions (e.g., "not enough stories" → increase generation)
- Pricing analysis (e.g., "too expensive" → consider promotional offers)
- Churn metrics (monthly churn rate, reason distribution)

## Stripe Integration

### Key Operations

**Pause Subscription:**
```typescript
// Sets cancel_at_period_end: true
// + stores resume date in metadata
await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true,
  metadata: {
    pausedAt: new Date().toISOString(),
    pauseResumeDate: futureDate.toISOString(),
  },
})
```

**Resume Subscription:**
```typescript
// Clears cancel_at_period_end flag
await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: false,
  metadata: {
    pausedAt: null,
    pauseResumeDate: null,
  },
})
```

**Cancel Subscription:**
```typescript
// Sets cancel_at_period_end: true
// User keeps access until current_period_end
await stripe.subscriptions.update(subscriptionId, {
  cancel_at_period_end: true,
  metadata: {
    cancelReason: 'user_initiated',
    otherReason: 'Too expensive',
  },
})
```

### Notes
- `cancel_at_period_end: true` means no immediate charge, but access continues until period end
- After period end, customer must resubscribe (use win-back email with promo code)
- Paused subscriptions are NOT fully cancelled — just `cancel_at_period_end: true` + metadata

## Configuration

### Environment Variables

```bash
# Cron authentication
CRON_SECRET=your-random-secret-key

# Email sending (via Resend)
RESEND_API_KEY=re_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_PRICE_MONTHLY=price_xxxxx
STRIPE_PRICE_ANNUAL=price_xxxxx
```

### Daily Cron Setup (Examples)

**Option 1: n8n Automation**
```
n8n Webhook → GET /api/retention/check?apiKey=<CRON_SECRET>
Schedule: Daily, 2 AM UTC
```

**Option 2: Vercel Crons** (Next.js 14+)
```typescript
// vercel.json
{
  "crons": [{
    "path": "/api/retention/check?apiKey=<CRON_SECRET>",
    "schedule": "0 2 * * *"
  }]
}
```

**Option 3: External Service** (cron-job.org, AWS EventBridge, etc.)
```bash
curl "https://wholesomelibrary.com/api/retention/check?apiKey=<CRON_SECRET>"
```

## User Flows

### Cancellation Flow
```
Parent clicks "Cancel" on Account tab
    ↓
Step 1: Value Reminder (display metrics)
    ├─ Option: Pause instead → /parent/pause
    └─ Option: Continue to cancel → Step 2
    ↓
Step 2: Reason Survey (record feedback)
    ├─ Option: Go back
    └─ Option: Continue → Step 3
    ↓
Step 3: Confirmation (final confirmation)
    ├─ Option: Keep subscription → back to dashboard
    └─ Option: Confirm → process cancellation
    ↓
Confirmation Page
    ├─ Cancel email sent
    ├─ Stripe updated (cancel_at_period_end: true)
    └─ Show end date + resubscribe link
```

### Pause Flow
```
Parent clicks "Take a Break"
    ↓
Pause Page (explain pause benefits)
    ├─ Option: Keep reading → back
    └─ Option: Pause for 1 Month → process
    ↓
Stripe updated (cancel_at_period_end: true + metadata)
    ↓
Redirect to dashboard with success message
```

### Retention Checks (Daily Cron)
```
2 AM UTC: Cron job runs /api/retention/check
    ↓
Check 1: Trial Ending (2 days before)
    └─ Send "Trial ends in 2 days" email + metrics
    ↓
Check 2: Inactivity (7+ days no reading)
    └─ Send "We miss [child]! New story available" email
    ↓
Check 3: Win-back (30 days post-cancel)
    └─ Send "Come back for 50% off" email
    ↓
Log results to console (check daily logs)
```

## Testing

### Local Testing

1. **Enable dev cron secret:**
   ```bash
   CRON_SECRET=dev-secret-key
   ```

2. **Trigger checks manually:**
   ```bash
   curl "http://localhost:3000/api/retention/check?apiKey=dev-secret-key"
   ```

3. **Test cancellation flow:**
   - Go to `/parent/cancel` (requires auth)
   - Go through all steps
   - Watch console for email logs

4. **Test pause flow:**
   - Go to `/parent/pause` (requires auth)
   - Click "Pause for 1 Month"
   - Watch for success message

### Production Testing

1. Use test Stripe account credentials
2. Set `CRON_SECRET` to a strong random value
3. Schedule one manual cron call to verify setup
4. Check logs for any errors
5. Set up daily automatic calls

## Troubleshooting

### Emails Not Sending
- Check `RESEND_API_KEY` is correct
- Check `RESEND_API_KEY` has proper permissions
- Check email addresses in database
- Check Resend logs for bounce/delivery errors

### Cron Job Not Running
- Verify `CRON_SECRET` matches in endpoint call
- Check server logs for HTTP 401 errors
- Verify cron scheduler is calling correct URL
- Test manually with curl command

### Stripe Subscription Not Updating
- Check `STRIPE_SECRET_KEY` is correct
- Check subscription ID exists in Stripe
- Check Stripe webhook is configured (for confirmation)
- Check Stripe Dashboard for any errors

### Reading Streak Not Calculating
- Verify `readingProgress.lastReadAt` timestamps are accurate
- Run manual calculation: `await calculateReadingStreak([childId])`
- Check database for proper timezone handling

## Future Enhancements

- [ ] Pause extension (let users extend pause before auto-resume)
- [ ] Reactivation incentives (e.g., "50% off if you reactivate in 14 days")
- [ ] Segment-specific win-back offers (based on cancel reason)
- [ ] Reading streak badges (visual milestone celebrations)
- [ ] "We're improving!" emails (tell cancelled users about new features)
- [ ] Graduated resubscription prompts (start with pause, then mentions win-back)
- [ ] A/B testing on email subject lines and offers

## Support

For questions about:
- **Cancellation flow logic** → See `lib/retention.ts`
- **Email templates** → See `emails/` directory
- **UI styling** → Check component classes (tailwind)
- **Stripe integration** → See `lib/stripe.ts`
- **Cron scheduling** → Check your scheduler config (n8n, Vercel, etc.)

## Git Commit

```bash
git add -A
git commit -m "build: add retention system (cancel, pause, win-back flows + daily cron checks)"
git push
```
