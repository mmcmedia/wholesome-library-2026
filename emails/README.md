# Email Templates

All email templates are built with React Email and sent via Resend.

## Templates

### 1. `welcome.tsx`
**Trigger:** User signs up
**Purpose:** Welcome new families, confirm trial started, guide first steps
**Props:**
- `parentName`: string
- `childName?`: string

### 2. `trial-ending.tsx`
**Trigger:** 2 days before trial expires
**Purpose:** Convert trial to paid subscription
**Props:**
- `parentName`: string
- `storiesRead`: number
- `childName?`: string

### 3. `weekly-digest.tsx`
**Trigger:** Every Sunday (automated)
**Purpose:** Engagement, show reading progress, recommend new stories
**Props:**
- `parentName`: string
- `childName`: string
- `storiesRead`: number
- `storiesReadTitles`: string[]
- `newStories`: Array<{ title, genre, slug }>
- `readingStreak?`: number

### 4. `re-engagement.tsx`
**Trigger:** 7 days inactive
**Purpose:** Win back inactive users
**Props:**
- `parentName`: string
- `childName`: string
- `favoriteGenre?`: string
- `recommendedStory`: { title, blurb, coverUrl, slug }

### 5. `win-back.tsx`
**Trigger:** 30 days post-cancel
**Purpose:** Offer discount to re-activate subscription
**Props:**
- `parentName`: string
- `newStoriesCount`: number

### 6. `level-up.tsx`
**Trigger:** Child ready for next reading level
**Purpose:** Celebrate growth, recommend new-level stories
**Props:**
- `parentName`: string
- `childName`: string
- `currentLevel`: string
- `nextLevel`: string
- `recommendedStories`: Array<{ title, slug }>

### 7. `story-notification.tsx`
**Trigger:** Weekly when new stories match child's preferences
**Purpose:** Drive engagement with personalized recommendations
**Props:**
- `parentName`: string
- `childName`: string
- `newStories`: Array<{ title, blurb, genre, readingLevel, coverUrl, slug }>

### 8. `cancellation.tsx`
**Trigger:** User cancels subscription
**Purpose:** Confirm cancellation, gather feedback, keep door open
**Props:**
- `parentName`: string
- `endDate`: string (e.g., "March 15, 2026")

## Usage

```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail({
  to: 'parent@example.com',
  parentName: 'Jane',
  childName: 'Emma',
});
```

## Email Service

- **Provider:** Resend
- **Free tier:** 3,000 emails/month
- **From address:** `hello@wholesomelibrary.com`
- **API key:** Set `RESEND_API_KEY` in `.env.local`

## Design System

All emails use:
- **Brand color:** `#135C5E` (teal)
- **Font:** System fonts (Apple, Segoe UI, Roboto)
- **Max width:** 600px
- **Mobile-responsive:** Yes
- **Logo:** https://wholesomelibrary.com/logo.png
- **Footer:** "Stories created with modern tools + editorial review" + unsubscribe link

## Testing Emails Locally

1. Install React Email dev tools:
```bash
npx react-email dev
```

2. Browse to `http://localhost:3000` to preview all templates

## Production Setup

1. Get Resend API key at https://resend.com
2. Add to `.env.local`: `RESEND_API_KEY=re_xxxxx`
3. Verify sending domain in Resend dashboard
4. Set up automated email triggers (see `/lib/email.ts`)

## Automated Email Triggers

These should be set up as cron jobs or background workers:

- **Welcome:** Trigger on signup (immediate)
- **Trial ending:** Run daily, check for trials expiring in 2 days
- **Weekly digest:** Run every Sunday at 9am
- **Re-engagement:** Run daily, check for 7-day inactive users
- **Win-back:** Run weekly, check for 30-day churned users
- **Level-up:** Run daily, check reading progress for level-up candidates
- **Story notification:** Run weekly after new stories are published
- **Cancellation:** Trigger immediately on subscription cancel event
