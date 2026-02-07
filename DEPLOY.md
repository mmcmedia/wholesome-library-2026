# Wholesome Library v2 — Deployment Guide

**Target Domain:** `wholesomelibrary.com`  
**Hosting Platform:** Vercel  
**Framework:** Next.js 15  
**Database:** Supabase (PostgreSQL)

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Step 1: GitHub Repository Setup](#step-1-github-repository-setup)
3. [Step 2: Vercel Project Creation](#step-2-vercel-project-creation)
4. [Step 3: Environment Variables](#step-3-environment-variables)
5. [Step 4: Custom Domain Setup](#step-4-custom-domain-setup)
6. [Step 5: Build & Deploy](#step-5-build--deploy)
7. [Step 6: Post-Deployment Verification](#step-6-post-deployment-verification)
8. [Step 7: Analytics & Monitoring](#step-7-analytics--monitoring)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedure](#rollback-procedure)

---

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All environment variables are configured (see Step 3)
- [ ] COPPA compliance pages are live (Privacy, Terms, About)
- [ ] Footer links point to correct pages
- [ ] No console errors in development (`npm run dev`)
- [ ] All images use proper `next/image` optimization
- [ ] `.env` file is NOT committed to git
- [ ] `.env.example` is updated with all required variables
- [ ] `vercel.json` is committed to repository
- [ ] All Stripe test payments have been completed
- [ ] Supabase database migrations are current
- [ ] Email templates (Resend) have been created
- [ ] Analytics events are firing correctly
- [ ] Mobile responsiveness tested on iPhone, iPad, Android
- [ ] Dark mode / Night mode works on reader page
- [ ] Story filtering and search functional
- [ ] Parent dashboard accessible and showing data
- [ ] Admin review queue working (if you need it pre-launch)
- [ ] Free trial flow complete without errors

---

## Step 1: GitHub Repository Setup

### 1.1 Initialize Git (if not already done)

```bash
cd /Users/mmcassistant/clawd/projects/wholesome-library-2026

# Check if git is initialized
git status

# If not initialized, initialize it
git init
git add .
git commit -m "Initial commit: Wholesome Library v2 - Phase 1 complete"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository: `wholesome-library` (or similar)
3. Choose **Private** (recommended for now)
4. Do NOT initialize with README, .gitignore, or license (we already have them)
5. Click "Create repository"

### 1.3 Connect Local to GitHub

```bash
git remote add origin https://github.com/[YOUR_USERNAME]/wholesome-library.git
git branch -M main
git push -u origin main
```

### 1.4 Verify Connection

```bash
git remote -v
# Should show:
# origin  https://github.com/[YOUR_USERNAME]/wholesome-library.git (fetch)
# origin  https://github.com/[YOUR_USERNAME]/wholesome-library.git (push)
```

---

## Step 2: Vercel Project Creation

### 2.1 Sign In to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub account (recommended for easiest integration)
3. Grant Vercel access to your GitHub repositories

### 2.2 Create New Project

1. Click "Add New..." → "Project"
2. Find your `wholesome-library` repository
3. Click "Import"
4. Configure project:
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. Do NOT add environment variables yet (we'll do it in Step 3)
6. Click "Deploy"

Vercel will now build and deploy a preview. This may fail due to missing env vars — that's OK.

### 2.3 Note Project URL

After creation, you'll see a preview URL like: `wholesome-library-xxxxx.vercel.app`

Save this for testing before domain switch.

---

## Step 3: Environment Variables

### 3.1 Collect All Credentials

Before proceeding, gather these from their respective services:

**Supabase:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

**Stripe:**
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_MONTHLY_PRICE_ID`
- [ ] `STRIPE_ANNUAL_PRICE_ID`

**Resend:**
- [ ] `RESEND_API_KEY`

**OpenAI (for generation worker):**
- [ ] `OPENAI_API_KEY`

**KIE.AI (cover art):**
- [ ] `KIE_AI_API_KEY`

**App Config:**
- [ ] `NEXT_PUBLIC_APP_URL` = `https://wholesomelibrary.com` (will update after domain is live)

### 3.2 Add to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click your `wholesome-library` project
3. Click "Settings" → "Environment Variables"
4. Add each variable from the list above:
   - Key: (exact variable name)
   - Value: (your credential)
   - Select environments: Production, Preview, Development (all three)
5. Click "Save" after each variable

### 3.3 Update `.env.local` for Development

Locally, create `.env.local` with the same variables:

```bash
# .env.local (NOT committed to git, don't share)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# etc.
```

### 3.4 Redeploy

1. Go to Vercel project
2. Click "Deployments"
3. Find the latest deployment
4. Click the three dots → "Redeploy"
5. This rebuild will now have all env vars available

---

## Step 4: Custom Domain Setup

### 4.1 Configure Domain in Vercel

1. In Vercel project, go to "Settings" → "Domains"
2. Enter domain: `wholesomelibrary.com`
3. Click "Add"
4. Vercel will show DNS records needed

### 4.2 Point Domain to Vercel (at Your Domain Registrar)

**For most registrars (GoDaddy, Namecheap, etc.):**

1. Log into your domain registrar's control panel
2. Find "DNS Settings" or "Name Servers"
3. You have two options:

**Option A: Update Name Servers (Recommended)**
- Delete existing name servers
- Add Vercel's name servers:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
  - `ns3.vercel-dns.com`
  - `ns4.vercel-dns.com`
- Wait 24-48 hours for DNS propagation

**Option B: Add CNAME Records (Faster, ~10 min)**
- Keep your current registrar's name servers
- Add a CNAME record:
  - Host: `wholesomelibrary.com` (or just leave blank for root)
  - Points to: `cname.vercel-dns.com.` (with trailing dot)
- Also add A records if required by your registrar

### 4.3 Verify Domain in Vercel

1. Go back to Vercel: Settings → Domains
2. Vercel will automatically check for DNS propagation
3. Once verified (usually 5-30 min), you'll see a green checkmark
4. Domain is now live

### 4.4 Force HTTPS

In Vercel Settings → Domains:
- Ensure "Redirect to HTTPS" is enabled (default)
- Ensure "Automatically Renew SSL Certificate" is enabled

---

## Step 5: Build & Deploy

### 5.1 Final Local Verification

Before production deploy:

```bash
# Build locally
npm run build

# Check for errors
# Should output:
# Route (Kind)                                Size
# ○ /                                        ...
# ○ /privacy                                 ...
# ○ /terms                                   ...
# ○ /about                                   ...

# Test local build
npm run start
# Visit http://localhost:3000 and verify pages load
```

### 5.2 Update App URL in Environment

Once domain is live:

1. Vercel Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` to `https://wholesomelibrary.com`
3. Redeploy (or wait for next git push)

### 5.3 Deploy to Production

**Option A: Via Vercel Dashboard**
1. Go to your Vercel project
2. Click "Deployments"
3. Find desired deployment
4. Click "Promote to Production"

**Option B: Via Git (Automatic)**
1. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Pre-launch: COPPA pages, Vercel config, deployment guide"
   git push origin main
   ```
2. Vercel automatically deploys main branch to production

---

## Step 6: Post-Deployment Verification

### 6.1 Domain Check

- [ ] Visit `https://wholesomelibrary.com` (loads without warnings)
- [ ] SSL certificate valid (green lock in browser)
- [ ] No redirect loops or 404 errors

### 6.2 Smoke Test Checklist

**Landing Page:**
- [ ] Homepage loads
- [ ] Hero section displays correctly
- [ ] CTA buttons work
- [ ] Pricing section visible
- [ ] Footer links all work

**Legal Pages:**
- [ ] `/privacy` loads and displays COPPA info
- [ ] `/terms` loads and displays subscription terms
- [ ] `/about` loads with values displayed
- [ ] All links in footer point to correct pages

**Auth Flow:**
- [ ] `/auth/signup` loads
- [ ] Email signup works
- [ ] Free trial starts correctly
- [ ] Payment integration shows (Stripe modal)

**Library Pages:**
- [ ] `/library` loads if logged in
- [ ] Stories display with cover images
- [ ] Filters work (reading level, genre, etc.)
- [ ] Search functionality works

**Story Reader:**
- [ ] Click a story → reader page loads
- [ ] Text is readable with good contrast
- [ ] Font size adjustment works
- [ ] Dark mode toggle works (if implemented)
- [ ] Chapter navigation works

**Parent Dashboard:**
- [ ] `/parent` requires login
- [ ] Dashboard loads
- [ ] Reading activity displays
- [ ] Settings accessible

**Mobile Responsiveness:**
- [ ] Test on iPhone (iOS Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on iPad (landscape + portrait)
- [ ] Tap targets are ≥44px
- [ ] No horizontal scrolling

### 6.3 Performance Check

1. Open DevTools (Chrome → F12)
2. Go to "Lighthouse" tab
3. Run audit (Mobile + Desktop)
4. Aim for scores:
   - Performance: ≥85
   - Accessibility: ≥90
   - Best Practices: ≥90
   - SEO: ≥90

### 6.4 Security Check

1. Go to https://securityheaders.com
2. Enter `wholesomelibrary.com`
3. Check that security headers are present:
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy

### 6.5 Console Errors

1. In DevTools, check Console tab
2. No red errors (warnings are OK for now)
3. No 404s for assets
4. Network tab shows no failed requests

---

## Step 7: Analytics & Monitoring

### 7.1 Enable Vercel Analytics

1. Vercel Project → Settings → Monitoring
2. Click "Enable Analytics"
3. Vercel collects performance metrics automatically

### 7.2 Create Vercel Alerts (Optional)

1. Vercel Project → Settings → Monitoring → Alerts
2. Set up alerts for:
   - Build failure
   - Production deployment errors
   - High error rate
   - Slow performance

### 7.3 Set Up Error Tracking

If using Sentry or similar:

1. Create account at https://sentry.io
2. Create project for Wholesomelibrary
3. Add to `.env.example`:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/yyyy
   ```
4. Add to environment variables in Vercel

### 7.4 Monitor First 24 Hours

- [ ] Watch Vercel Analytics dashboard
- [ ] Check for error spikes
- [ ] Monitor deployment logs
- [ ] Test critical user journeys multiple times
- [ ] Have rollback plan ready (see Step 10)

---

## Troubleshooting

### Build Fails in Vercel

**Symptom:** Deployment shows "Build Failed"

**Solution:**
1. Click deployment in Vercel
2. Look at Build Logs tab
3. Common issues:
   - Missing env var → Add to Environment Variables
   - ESLint error → Fix in code, commit, redeploy
   - Type error → Fix TypeScript, commit, redeploy
   - Out of memory → Check for infinite loops in code

### Domain Not Resolving

**Symptom:** `wholesome-library.com` shows "Server not found"

**Solution:**
1. Check DNS in your registrar's control panel
2. Verify name servers or CNAME records match Vercel's requirements
3. Wait up to 48 hours for full propagation
4. Clear browser cache (Cmd+Shift+Delete)
5. Test with different DNS: `nslookup wholesomelibrary.com`

### Images Not Loading

**Symptom:** Story covers or product images show 404

**Solution:**
1. Check Supabase storage bucket is public
2. Verify bucket name in `next.config.ts` matches actual bucket
3. Check Supabase remotePatterns in next.config.ts

### Stripe Payments Not Working

**Symptom:** Stripe modal shows but payment fails

**Solution:**
1. Verify `STRIPE_SECRET_KEY` is correct (sk_live_ or sk_test_)
2. Verify `STRIPE_PUBLISHABLE_KEY` is correct (pk_live_ or pk_test_)
3. Check Stripe webhooks are configured
4. Test with Stripe's test card: `4242 4242 4242 4242`

### Emails Not Sending

**Symptom:** Users don't receive confirmation emails

**Solution:**
1. Check `RESEND_API_KEY` is correct
2. Verify email templates exist in Resend
3. Check Resend domain is verified (verify SPF/DKIM)
4. Check email logs in Resend dashboard

---

## Rollback Procedure

If something goes wrong in production:

### Quick Rollback (Same Day)

1. Go to Vercel Project → Deployments
2. Find the previous stable deployment (before your changes)
3. Click three dots → "Promote to Production"
4. Vercel redeploys immediately

### Longer Rollback (Days Later)

1. Revert your commit in GitHub:
   ```bash
   git log --oneline  # Find commit to revert
   git revert [COMMIT_HASH]
   git push origin main
   ```
2. Vercel automatically redeploys

### Database/Data Issue

If the issue is data-related (e.g., corrupted story):
1. Check Supabase backups
2. Contact Supabase support if needed
3. Do NOT rollback code if only data is affected

---

## Post-Launch Checklist

After deploying to production:

- [ ] Visit live domain multiple times from different devices
- [ ] Test signup flow end-to-end
- [ ] Verify first payment processes correctly
- [ ] Check email notifications arrive
- [ ] Monitor Vercel analytics for next 24 hours
- [ ] Set up daily monitoring routine
- [ ] Document any issues found during launch
- [ ] Prepare launch announcement (email, social, blog)
- [ ] Schedule post-launch retrospective (24 hours later)

---

## Support & Questions

If deployment issues arise:

**Vercel Support:** https://vercel.com/support  
**Supabase Support:** https://supabase.com/docs/guides/troubleshooting  
**Stripe Support:** https://support.stripe.com  
**GitHub:** Use repo's Issues tab

---

**Deployment Date:** [TBD]  
**Last Updated:** February 2026  
**Next Steps:** Post-launch monitoring and user feedback loop
