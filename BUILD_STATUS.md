# Wholesome Library v2 - Build Status

## Overview
Building a complete Next.js 15 application for Wholesome Library v2 from scratch, following the PRD at `/Users/mmcassistant/clawd/projects/wholesome-library-v2/PRD.md`.

**GitHub Repo:** https://github.com/mmcmedia/wholesome-library-2026.git  
**Project Location:** `/Users/mmcassistant/clawd/projects/wholesome-library-2026`

---

## Phase 0: Scaffold ✅ (75% Complete)

### Completed
- ✅ Next.js 15 project created (App Router, TypeScript, Tailwind)
- ✅ All dependencies installed (Supabase, Drizzle, tRPC, Radix UI, Resend, etc.)
- ✅ Tailwind config ported (exact teal theme, gradients, animations from old project)
- ✅ Global CSS with custom styles (hand-drawn underline, float animations, OpenDyslexic font)
- ✅ Complete Drizzle schema created (all tables from PRD Section 11.1)
- ✅ Supabase migration file created with full SQL (RLS policies, triggers, indexes)
- ✅ Drizzle config file created
- ✅ Folder structure created (components, lib, generation, supabase, emails)
- ✅ Environment variables template (.env.example)
- ✅ Supabase client utilities (client.ts, server.ts, middleware.ts)
- ✅ Next.js middleware for auth session refresh

### In Progress
- 🔄 tRPC setup (router, context, procedures)
- 🔄 Utility functions (cn, slugify, etc.)
- 🔄 Resend email configuration
- 🔄 Generation pipeline folder structure with stubs

### To Do
- ⬜ shadcn/ui component installation (Button, Card, Input, Select, etc.)
- ⬜ lib/utils.ts and other helper files
- ⬜ Type definitions and interfaces
- ⬜ GitHub repo initialization

---

## Phase 1: Core Pages (0% Complete)

### Landing Page (`/app/page.tsx`)
- ⬜ Port HeroSection from old project
- ⬜ Update copy (new pricing: $7.99/mo, $59.99/yr, 7-day free trial)
- ⬜ Features section
- ⬜ How it works
- ⬜ Story preview carousel (5 free stories)
- ⬜ Testimonials
- ⬜ FAQ accordion
- ⬜ Pricing section

### Library Browse Page (`/app/library/page.tsx`)
- ⬜ Story grid layout
- ⬜ Filter UI (reading level, genre, virtue, content tags)
- ⬜ Search functionality
- ⬜ Story cards with cover, title, blurb, tags
- ⬜ "Continue Reading" section
- ⬜ "Recommended for [Child]" section

### Story Reader Page (`/app/story/[slug]/page.tsx`)
- ⬜ Clean, distraction-free reading experience
- ⬜ Chapter navigation (prev/next, chapter list)
- ⬜ Font size adjustment (3 sizes)
- ⬜ Dark mode toggle
- ⬜ Progress tracking
- ⬜ Swipe support for mobile
- ⬜ "More like this" recommendations at end

### Auth Pages (`/app/auth/*`)
- ⬜ Signup page with child profile creation
- ⬜ Optional reading level quiz
- ⬜ Login page
- ⬜ Forgot password page
- ⬜ Supabase auth integration

### Parent Dashboard (`/app/parent/page.tsx`)
- ⬜ Reading activity summary per child
- ⬜ Content preferences UI
- ⬜ Child profile management
- ⬜ Account settings
- ⬜ Subscription management (Stripe portal link)

### Admin Panel (`/app/admin/*`)
- ⬜ Review queue page (`/admin/queue`)
- ⬜ Story review page (`/admin/review/[id]`)
- ⬜ Library management page (`/admin/library`)
- ⬜ Generation dashboard (`/admin/generation`)
- ⬜ Auth protection (editor role required)

---

## Design System (Ported from Old Project)

### Colors
- **Primary Teal:** #135C5E (with full teal scale 50-950)
- **Gradient:** #1FAAAA → #1DDDDC
- **Charcoal Text:** #2D3748
- **Hand-drawn Underline:** Orange #F2994A

### Fonts
- **Primary:** Poppins (300, 400, 500, 600, 700)
- **Accessibility:** OpenDyslexic (optional toggle)

### Animations
- Float animations (slow, medium, fast)
- Slide-up entrance
- Glow effect
- Hand-drawn underline wiggle

### Components to Port
All design patterns are available in `/Users/mmcassistant/clawd/projects/wholesome2.0/components/`

---

## Tech Stack Summary

| Layer | Technology | Status |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | ✅ Installed |
| Styling | Tailwind CSS + shadcn/ui | ✅ Configured |
| Database | Supabase (PostgreSQL) | ⬜ Needs credentials |
| Auth | Supabase Auth | ✅ Config ready |
| ORM | Drizzle ORM | ✅ Schema complete |
| API | tRPC | 🔄 In progress |
| Payments | Stripe Checkout | ⬜ To configure |
| Email | Resend | ⬜ To configure |
| AI | OpenAI GPT-5.2 | ⬜ Generation pipeline |
| Image Gen | Nano Banana (kie.ai) | ⬜ Cover generation |
| Hosting | Vercel | ⬜ Deploy ready |

---

## Database Schema Status

### Tables Created ✅
1. profiles (extends auth.users)
2. children
3. content_preferences
4. stories
5. chapters
6. story_dna
7. story_briefs (generation queue)
8. reading_progress
9. editor_reviews
10. analytics_events

### Features Implemented
- ✅ All enums (reading_level, story_status, brief_status, plan)
- ✅ Foreign key relationships
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Triggers for updated_at timestamps
- ✅ Auto slug generation for stories
- ✅ GIN index for content_tags array search

---

## API Routes (tRPC) - To Be Built

### Public Routes
- `stories.listPublished` - Browse library
- `stories.getById` - Get story with chapters
- `stories.preview` - Get first chapter only

### Authenticated Routes (Parent)
- `auth.getSession`
- `children.list/create/update`
- `preferences.get/update`
- `progress.get/update/complete`

### Admin Routes (Editor)
- `admin.queue.list/review/approve/reject`
- `admin.library.list/update/unpublish`
- `admin.briefs.list/create`
- `admin.stats.generation/library`

---

## Generation Pipeline - Stub Structure

Location: `/generation/`

Files to create:
- `pipeline.ts` - Main orchestrator
- `brief-manager.ts` - Queue management
- `story-creator.ts` - V3 DNA + chapter generation
- `quality-check.ts` - Automated scoring
- `safety-scan.ts` - Content safety
- `values-check.ts` - Values alignment
- `cover-generator.ts` - Nano Banana integration
- `run.ts` - Entry point for cron/worker

These will be STUBS ONLY for Phase 0 - full implementation in later phase.

---

## Critical Files Still Needed

### Infrastructure
- [ ] `lib/utils.ts` - cn(), slugify(), etc.
- [ ] `lib/trpc/client.ts` - tRPC client setup
- [ ] `lib/trpc/server.ts` - tRPC server setup
- [ ] `lib/trpc/router.ts` - Main router
- [ ] `lib/trpc/context.ts` - Request context
- [ ] `lib/db/index.ts` - Drizzle client instance
- [ ] `app/api/trpc/[trpc]/route.ts` - API handler

### Components (shadcn/ui)
- [ ] Button, Card, Input, Label, Select
- [ ] Checkbox, Tabs, Accordion, Dialog
- [ ] DropdownMenu
- [ ] Theme provider

### Layout
- [ ] `app/layout.tsx` - Root layout with fonts, theme provider
- [ ] `components/layout/navbar.tsx`
- [ ] `components/layout/footer.tsx`

---

## Next Immediate Steps

1. **Install missing dependencies:**
   ```bash
   npm install @supabase/ssr dotenv
   ```

2. **Set up tRPC complete structure**

3. **Install shadcn/ui components:**
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add button card input label select checkbox tabs accordion dialog dropdown-menu
   ```

4. **Create utility functions (lib/utils.ts)**

5. **Build landing page** (port from old project)

6. **Initialize Git and push to GitHub**

7. **Create README.md with setup instructions**

---

## Blockers

### Immediate
None - can continue building without credentials

### Before Deployment
- ⚠️ McKinzie needs to create Supabase project (don't run migrations yet)
- ⚠️ Need Stripe account setup
- ⚠️ Need Resend API key
- ⚠️ Need OpenAI API key (for generation)
- ⚠️ Need kie.ai API key (for cover generation)

---

## How to Run Locally (Once Complete)

1. Clone repo:
   ```bash
   git clone https://github.com/mmcmedia/wholesome-library-2026.git
   cd wholesome-library-2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   # Fill in credentials
   ```

4. Run dev server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

---

## Timeline Estimate

- **Phase 0 completion:** 2-3 hours (remaining work)
- **Phase 1 completion:** 8-12 hours (all core pages)
- **Design polish & testing:** 4-6 hours
- **Total estimated:** 15-20 hours of dev work

With overnight build by sub-agent, majority could be complete by morning.

---

Last updated: Feb 6, 2026 22:54 MST
