# Wholesome Library v2

A curated digital library of AI-generated children's stories that parents can trust — every story reviewed, every page safe, no surprises.

## Overview

Wholesome Library provides a growing collection of high-quality, values-aligned stories for children ages 4-12. Every story passes automated quality checks AND human editorial review before publication.

**Live Site:** Coming Soon  
**Status:** In Development  
**PRD:** [Full Product Requirements Document](https://github.com/mmcmedia/wholesome-library-2026/blob/main/PRD.md)

---

## Key Features

- ✅ **Curated Content** — Every story reviewed before your child sees it
- ✅ **Values Filtering** — Parents control themes, content, and genres
- ✅ **Reading Levels** — Stories matched to your child's ability
- ✅ **Ever-Growing Library** — New stories added daily via AI generation
- ✅ **Mobile-First** — Optimized for bedtime reading on phones/tablets
- ✅ **Dark Mode** — Comfortable nighttime reading
- ✅ **Progress Tracking** — See what your child has read

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, TypeScript) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **ORM** | Drizzle ORM |
| **API** | tRPC (end-to-end type safety) |
| **Payments** | Stripe Checkout |
| **Email** | Resend (React Email templates) |
| **AI** | OpenAI GPT-5.2 (story generation) |
| **Image Gen** | Nano Banana via kie.ai (cover art) |
| **Hosting** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Stripe account (for payments)
- Resend account (for email)
- OpenAI API key (for story generation)
- kie.ai API key (for cover generation)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mmcmedia/wholesome-library-2026.git
   cd wholesome-library-2026
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Fill in the following in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `OPENAI_API_KEY` - OpenAI API key
   - `RESEND_API_KEY` - Resend API key
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
   - `KIE_AI_API_KEY` - kie.ai API key

4. **Set up the database:**

   First, create a new Supabase project at [supabase.com](https://supabase.com).

   Then run the migration:
   ```bash
   # This command will be added once Drizzle push is configured
   # For now, run the SQL migration manually in Supabase SQL Editor:
   # /supabase/migrations/0001_initial_schema.sql
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
wholesome-library-2026/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── library/           # Library browse
│   ├── story/[slug]/      # Story reader
│   ├── auth/              # Signup, login, forgot password
│   ├── parent/            # Parent dashboard
│   ├── admin/             # Admin panel (review queue, etc.)
│   └── api/trpc/          # tRPC API handler
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── library/           # Library-specific components
│   ├── reader/            # Story reader components
│   ├── parent/            # Parent dashboard components
│   └── admin/             # Admin panel components
├── lib/
│   ├── trpc/              # tRPC router + procedures
│   ├── supabase/          # Supabase client utilities
│   ├── db/                # Drizzle schema + queries
│   └── utils/             # Shared utilities
├── emails/                # React Email templates
├── generation/            # Story generation pipeline (NOT in web app)
├── supabase/
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

---

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Database Changes

When you modify the database schema:

1. Update `lib/db/schema.ts`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Apply migration:
   ```bash
   npm run db:push
   ```

### Adding Components

We use [shadcn/ui](https://ui.shadcn.com/) for UI components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
# etc.
```

---

## Design System

### Colors

- **Primary Teal:** `#135C5E` (full scale 50-950 in tailwind.config.ts)
- **Gradient:** `#1FAAAA` → `#1DDDDC`
- **Charcoal Text:** `#2D3748`
- **Accent Orange:** `#F2994A` (hand-drawn underline effect)

### Typography

- **Primary Font:** Poppins (300, 400, 500, 600, 700)
- **Accessibility Font:** OpenDyslexic (optional toggle)

### Animations

- Float animations (slow, medium, fast)
- Hand-drawn underline wiggle
- Slide-up entrance effects
- Glow animations

---

## Key Decisions

### Pricing
- **Family Plan:** $7.99/month (unlimited reading, up to 5 children)
- **Annual Plan:** $59.99/year ($5/month, ~37% savings)
- **Free Trial:** 7 days, no credit card required
- **Free Preview:** 5 stories always available without signup

### Reading Levels
- **Early Reader** (ages 4-6, Pre-K to 1st grade) - 3 chapters, 400-600 words each
- **Independent** (ages 7-8, 2nd-3rd grade) - 5 chapters, 800-1,200 words each
- **Confident** (ages 9-10, 4th-5th grade) - 5-7 chapters, 1,200-1,800 words each
- **Advanced** (ages 11-12, 6th-7th grade) - 7-10 chapters, 1,800-2,500 words each

### Content Philosophy
- **Non-denominational faith** - Universal language, no denomination-specific terms
- **Values-first** - Every story demonstrates a virtue (courage, kindness, honesty, etc.)
- **Parent-controlled filtering** - Parents choose what themes their children see
- **No surprises** - Every story reviewed before publication

---

## Contributing

This is a private project for MMC Media. If you're part of the team:

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly (especially mobile!)
4. Submit a pull request
5. Request review from McKinzie or team lead

### Code Style

- Use TypeScript for everything
- Follow existing patterns in the codebase
- Use Tailwind utilities over custom CSS
- Keep components small and focused
- Write accessible HTML (WCAG AA minimum)

---

## Deployment

### Vercel (Production)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

Vercel will automatically deploy:
- `main` branch → production
- Pull requests → preview deployments

### Environment Variables

All required environment variables are documented in `.env.example`.

**Critical:** Never commit `.env.local` to Git!

---

## Legal & Compliance

This app serves children under 13 and must comply with **COPPA** (Children's Online Privacy Protection Act).

Key compliance measures:
- Only parents create accounts (must be 18+)
- Children never enter email or create accounts
- Minimal data collection (first name only for children)
- Clear privacy policy and children's privacy policy
- Parent can access/delete all child data

See [PRD Section 20](./PRD.md#20-legal--compliance-coppa) for full compliance checklist.

---

## Architecture Notes

### Why tRPC?
End-to-end type safety from database to UI. No API contracts to maintain. Excellent DX.

### Why Drizzle over Prisma?
Lighter weight, more SQL-like, better for serverless. Drizzle plays nicely with Supabase.

### Why Supabase?
Auth + database + storage + realtime in one. Great free tier. Easy RLS policies.

### Why Next.js App Router?
Server components = faster initial loads. Built-in layouts. Better streaming. Future-proof.

### Why Not Edge Functions?
Story generation (5-10 min) doesn't fit in Edge timeout limits. Background workers handle generation.

---

## Roadmap

### v1.0 (Launch)
- ✅ Landing page
- ✅ Library browse with filters
- ✅ Story reader (mobile-optimized)
- ✅ Auth (signup, login)
- ✅ Parent dashboard
- ✅ Admin review queue
- ✅ 50+ curated stories
- ✅ Payment integration
- ✅ Email notifications

### v1.5 (Post-Launch)
- Offline reading (PWA)
- Reading streaks
- Auto reading level adjustment
- High contrast mode
- OpenDyslexic font toggle

### v2.0
- Custom story generation (premium)
- Audio narration
- Social features
- Educator tools
- Native mobile apps

---

## Support

For questions or issues:
- **Team:** Internal Slack channel
- **McKinzie:** mckinzie@momsmakecents.com
- **Tech Lead:** (TBD)

---

## License

Proprietary - © 2026 MMC Media LLC. All rights reserved.

---

Built with ❤️ by the MMC Media team.
