# Wholesome Library v2 - Development Checklist

## Phase 0: Infrastructure & Scaffold

### Core Setup ✅
- [x] Create Next.js 15 project
- [x] Install all dependencies
- [x] Configure Tailwind with exact old theme
- [x] Create global CSS with custom animations
- [x] Set up folder structure
- [x] Create .env.example

### Database & ORM ✅
- [x] Create Drizzle schema (all tables)
- [x] Create migration SQL file with RLS
- [x] Configure Drizzle
- [x] Create Supabase client utilities
- [x] Set up Next.js middleware for auth

### API Layer (tRPC) ✅ Stubs Created
- [x] tRPC init and context
- [x] Create all router stubs (stories, auth, children, progress, preferences, admin)
- [ ] Implement stories router queries
- [ ] Implement auth router
- [ ] Implement children CRUD
- [ ] Implement progress tracking
- [ ] Implement preferences management
- [ ] Implement admin endpoints
- [ ] Create tRPC client setup
- [ ] Create API route handler

### Utilities ✅
- [x] Create lib/utils.ts (cn, slugify, formatDate, etc.)
- [ ] Create type definitions
- [ ] Create constants file

### Component Library
- [ ] Run `npx shadcn@latest init`
- [ ] Install Button
- [ ] Install Card
- [ ] Install Input, Label
- [ ] Install Select, Checkbox
- [ ] Install Tabs, Accordion
- [ ] Install Dialog, DropdownMenu
- [ ] Create theme provider component

### Email Setup
- [ ] Install Resend properly
- [ ] Create React Email templates folder structure
- [ ] Create welcome email template
- [ ] Create trial ending email template

### Generation Pipeline (Stubs Only for v1)
- [ ] Create generation/ folder structure
- [ ] pipeline.ts stub
- [ ] brief-manager.ts stub
- [ ] story-creator.ts stub
- [ ] quality-check.ts stub
- [ ] safety-scan.ts stub
- [ ] values-check.ts stub
- [ ] cover-generator.ts stub

---

## Phase 1: Core Pages & Features

### Layout Components
- [ ] Create app/layout.tsx with fonts and providers
- [ ] Create Navbar component
- [ ] Create Footer component
- [ ] Configure font imports (Poppins)

### Landing Page (`/app/page.tsx`)
- [ ] Port HeroSection from old project
- [ ] Update hero copy (new pricing, value prop)
- [ ] Create QuickTestimonial component
- [ ] Create HowItWorks section
- [ ] Create FeaturesSection
- [ ] Create StoriesPreview carousel
- [ ] Create Testimonials section
- [ ] Create MissionSpotlight
- [ ] Create FAQ accordion
- [ ] Create pricing section (new prices: $7.99/mo, $59.99/yr)
- [ ] Update all CTAs to "Start Reading Free"

### Library Browse Page (`/app/library/page.tsx`)
- [ ] Create page layout
- [ ] Create StoryCard component
- [ ] Create filter UI (ReadingLevel, Genre, Virtue, ContentTags)
- [ ] Create search input
- [ ] Implement grid layout
- [ ] Create "Continue Reading" section
- [ ] Create "Recommended for [Child]" section
- [ ] Connect to tRPC stories.listPublished
- [ ] Add pagination
- [ ] Handle loading/empty states

### Story Reader Page (`/app/story/[slug]/page.tsx`)
- [ ] Create page layout
- [ ] Create chapter display component
- [ ] Create chapter navigation (prev/next buttons)
- [ ] Create chapter list sidebar
- [ ] Add font size adjustment controls
- [ ] Add dark mode toggle
- [ ] Implement progress tracking
- [ ] Add swipe gesture support (mobile)
- [ ] Create "More like this" recommendations
- [ ] Add "Report a Problem" button
- [ ] Add "Too Easy/Too Hard" feedback buttons
- [ ] Handle loading/error states

### Auth Pages
- [ ] Create `/app/auth/signup/page.tsx`
  - [ ] Email + password form
  - [ ] Child profile creation
  - [ ] Reading level selector
  - [ ] Optional reading level quiz
  - [ ] Connect to Supabase Auth
- [ ] Create `/app/auth/login/page.tsx`
- [ ] Create `/app/auth/forgot-password/page.tsx`
- [ ] Add auth error handling
- [ ] Add redirect logic after auth

### Parent Dashboard (`/app/parent/page.tsx`)
- [ ] Create layout
- [ ] Reading activity summary component
- [ ] Child selector/tabs
- [ ] Content preferences form
- [ ] Child profile management
- [ ] Account settings section
- [ ] Subscription management (Stripe portal link)
- [ ] Connect to tRPC endpoints

### Admin Panel (`/app/admin/*`)
- [ ] Create admin layout with navigation
- [ ] `/admin/queue/page.tsx` - Review queue
  - [ ] Story list with auto-scores
  - [ ] Tiered review indicators
  - [ ] Filter by score/level
- [ ] `/admin/review/[id]/page.tsx` - Story review
  - [ ] Full story display
  - [ ] Score breakdown sidebar
  - [ ] Approve/Reject/Edit actions
  - [ ] Notes textarea
- [ ] `/admin/library/page.tsx` - Library management
  - [ ] Published stories list
  - [ ] Inline editing
  - [ ] Unpublish action
- [ ] `/admin/generation/page.tsx` - Generation dashboard
  - [ ] Stats display
  - [ ] Manual brief creation form
- [ ] Add role-based access control

---

## Phase 2: Polish & Integration

### Styling & UX
- [ ] Ensure mobile responsiveness on all pages
- [ ] Test dark mode throughout
- [ ] Add loading skeletons
- [ ] Polish animations and transitions
- [ ] Test swipe gestures on mobile
- [ ] Verify all color contrast (WCAG AA)
- [ ] Test font size adjustment
- [ ] Add OpenDyslexic font files to /public/fonts

### Integrations
- [ ] Stripe Checkout setup
  - [ ] Create Stripe products ($7.99/mo, $59.99/yr)
  - [ ] Create checkout session endpoint
  - [ ] Handle webhook for subscription events
  - [ ] Test payment flow
- [ ] Resend email testing
  - [ ] Test welcome email
  - [ ] Test trial ending email
- [ ] OpenAI API connection (generation workers)
- [ ] Nano Banana API connection (cover generation)

### SEO & Meta
- [ ] Add metadata to all pages
- [ ] Create sitemap generator
- [ ] Add structured data (Schema.org Book type)
- [ ] Add Open Graph tags
- [ ] Create robots.txt
- [ ] Add canonical URLs

### Analytics
- [ ] Set up Vercel Analytics
- [ ] Implement event tracking (analyticsEvents table)
- [ ] Track key events (signup, story_started, story_completed, etc.)
- [ ] Create analytics helper functions

### Testing
- [ ] Test signup flow end-to-end
- [ ] Test reading flow end-to-end
- [ ] Test payment flow end-to-end
- [ ] Test admin review flow
- [ ] Mobile device testing (iPhone, iPad, Android)
- [ ] Desktop browser testing (Chrome, Safari, Firefox)
- [ ] Test with screen reader
- [ ] Test keyboard navigation

---

## Phase 3: Deployment & Launch Prep

### Documentation
- [ ] Create comprehensive README.md
- [ ] Document local setup steps
- [ ] Document environment variables
- [ ] Create CONTRIBUTING.md (if relevant)
- [ ] Document API routes

### Git & GitHub
- [ ] Initialize Git repo
- [ ] Create .gitignore (ensure .env.local ignored)
- [ ] Make initial commit
- [ ] Create GitHub repo
- [ ] Push to GitHub
- [ ] Set up branch protection (optional)

### Deployment
- [ ] Create Vercel project
- [ ] Link to GitHub repo
- [ ] Set environment variables in Vercel
- [ ] Deploy to production
- [ ] Test production deployment
- [ ] Set up custom domain (wholesomelibrary.com)
- [ ] Configure SSL

### Pre-Launch
- [ ] Create 5 free preview stories
- [ ] Generate initial 50 stories for launch library
- [ ] McKinzie reviews all 50 stories
- [ ] Generate cover art for all stories
- [ ] Create legal pages (Terms, Privacy, Children's Privacy)
- [ ] Set up Termly or iubenda for policies
- [ ] Set up cookie consent banner
- [ ] Final QA pass

---

## Future Phases (Post-Launch)

### v1.5 Features
- [ ] Offline reading (PWA + service worker)
- [ ] Reading streaks
- [ ] Level-up celebrations
- [ ] Auto reading level adjustment
- [ ] High contrast mode
- [ ] Reduced motion support

### v2 Features
- [ ] Custom story generation (premium)
- [ ] Audio narration
- [ ] Social features (sharing, reviews)
- [ ] Educator tools
- [ ] Mobile native apps (iOS, Android)
- [ ] Gamification (badges, achievements)

---

## Critical Path (Minimum Viable Launch)

1. ✅ Infrastructure setup (Phase 0)
2. Landing page
3. Library browse page
4. Story reader page
5. Auth flows
6. tRPC implementation
7. Database connection
8. Supabase setup (McKinzie)
9. Payment integration
10. 50 curated stories
11. Deploy to Vercel
12. Launch! 🚀

---

Last updated: Feb 6, 2026 22:56 MST
