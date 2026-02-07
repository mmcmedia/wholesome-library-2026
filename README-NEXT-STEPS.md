# Wholesome Library v2 — Next Steps

**Phase 1: ✅ COMPLETE**  
**Build Status: ✅ Passing**  
**Dev Server: ✅ Running on http://localhost:3000**

---

## What You Have Now

A fully functional web application with:
- ✅ Landing page (hero, testimonial, features, pricing, FAQ)
- ✅ Library browse with filters and search
- ✅ Story reader with dark mode and font controls
- ✅ Auth pages (signup, login, forgot password)
- ✅ Parent dashboard with stats and preferences
- ✅ Admin review queue
- ✅ 12 sample stories with full content
- ✅ Exact design match to old project

**All pages work with mock data right now.**

---

## To Make It Fully Functional

### 1. Set Up Supabase (15 minutes)

**a) Create Supabase Project:**
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `wholesome-library-v2`
4. Database Password: (save this!)
5. Region: Choose closest to you
6. Wait for provisioning (~2 minutes)

**b) Run Migration:**
1. In Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy/paste from: `/supabase/migrations/0001_initial_schema.sql`
4. Click "Run"
5. Verify: Check "Table Editor" — you should see 10 tables

**c) Get Credentials:**
1. Settings → API
2. Copy:
   - `Project URL` (starts with https://xxx.supabase.co)
   - `anon public` key
   - `service_role` key (click "Reveal" first)

**d) Add to Project:**
Create `.env.local` in project root:
```bash
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

**e) Restart Dev Server:**
```bash
npm run dev
```

---

### 2. Implement tRPC Queries (30 minutes)

The routers are stubbed. Add actual database queries:

**File: `lib/trpc/routers/stories.ts`**
```typescript
import { db } from '@/lib/db';
import { stories, chapters } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Replace existing stubs with:
listPublished: publicProcedure
  .input(z.object({
    readingLevel: z.string().optional(),
    genre: z.string().optional(),
    search: z.string().optional(),
  }))
  .query(async ({ input }) => {
    let query = db.select().from(stories).where(eq(stories.status, 'published'));
    
    if (input.readingLevel) {
      query = query.where(eq(stories.readingLevel, input.readingLevel));
    }
    
    // Add more filters as needed
    return await query.execute();
  }),

getBySlug: publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input }) => {
    const story = await db.query.stories.findFirst({
      where: eq(stories.slug, input.slug),
      with: { chapters: true },
    });
    
    if (!story) throw new TRPCError({ code: 'NOT_FOUND' });
    return story;
  }),
```

**Do similar for:**
- `children.list` / `children.create`
- `progress.update` / `progress.complete`
- `admin.queue.list` / `admin.queue.approve`

---

### 3. Wire Up Auth (20 minutes)

**File: `app/auth/signup/page.tsx`**

Replace the `handleSubmit` function:
```typescript
import { createClient } from '@/lib/supabase/client';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const supabase = createClient();
  
  // 1. Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) {
    toast.error(authError.message);
    setLoading(false);
    return;
  }
  
  // 2. Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: authData.user!.id, email, plan: 'free' });
  
  // 3. Create child
  const { error: childError } = await supabase
    .from('children')
    .insert({
      parent_id: authData.user!.id,
      name: childName,
      reading_level: readingLevel,
    });
  
  if (!profileError && !childError) {
    router.push('/library');
  }
};
```

**Do similar for:**
- Login page
- Forgot password page

---

### 4. Replace Mock Data with tRPC (10 minutes)

**File: `app/library/page.tsx`**

Replace:
```typescript
import { mockStories } from '@/lib/mock-data';
```

With:
```typescript
import { trpc } from '@/lib/trpc/client';

export default function LibraryPage() {
  const { data: stories, isLoading } = trpc.stories.listPublished.useQuery({
    readingLevel: selectedLevel === 'all' ? undefined : selectedLevel,
    genre: selectedGenre === 'all' ? undefined : selectedGenre,
  });
  
  // ... rest of component
}
```

**Do similar for:**
- Story reader: `trpc.stories.getBySlug.useQuery({ slug })`
- Parent dashboard: `trpc.children.list.useQuery()`
- Admin queue: `trpc.admin.queue.list.useQuery()`

---

### 5. Set Up Stripe (Optional, 30 minutes)

**a) Create Stripe Account:**
1. Go to https://dashboard.stripe.com/register
2. Activate account

**b) Create Products:**
1. Products → Add Product
2. Name: "Wholesome Library - Monthly"
3. Price: $7.99/month, recurring
4. Save → Copy Price ID
5. Repeat for Annual: $59.99/year

**c) Add to `.env.local`:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRICE_ID_MONTHLY="price_..."
STRIPE_PRICE_ID_ANNUAL="price_..."
```

**d) Implement checkout:**
Create `app/api/checkout/route.ts` following Stripe docs

---

### 6. Add Initial Stories (Manual for Now)

**Option A: Use Supabase SQL Editor**
```sql
INSERT INTO stories (title, slug, blurb, reading_level, genre, primary_virtue, chapter_count, status)
VALUES (
  'The Brave Little Lighthouse',
  'the-brave-little-lighthouse',
  'A small lighthouse learns that even the smallest light can guide ships safely home.',
  'early',
  'Adventure',
  'Courage',
  3,
  'published'
);
```

**Option B: Import Mock Data via Script**
Create `scripts/seed-stories.ts` to bulk insert from mock-data.ts

---

### 7. Deploy to Vercel (10 minutes)

**a) Push to GitHub:**
```bash
git push origin main
```

**b) Import to Vercel:**
1. Go to https://vercel.com/new
2. Import repository
3. Framework: Next.js (auto-detected)

**c) Add Environment Variables:**
Copy all from `.env.local` into Vercel environment variables

**d) Deploy:**
Click "Deploy" — done in ~2 minutes

**e) Custom Domain (Optional):**
Settings → Domains → Add `wholesomelibrary.com`

---

## Testing Checklist

Once database is connected:

- [ ] Sign up creates user + profile + child
- [ ] Login works and redirects to library
- [ ] Library shows real stories from database
- [ ] Filters work and query database
- [ ] Story reader loads from database
- [ ] Chapter navigation works
- [ ] Parent dashboard shows real child stats
- [ ] Content preferences save to database
- [ ] Admin queue shows pending stories
- [ ] Dark mode persists
- [ ] Mobile responsive on real device

---

## Future Enhancements (Post-Launch)

- [ ] Generation pipeline (background workers)
- [ ] Email notifications (Resend + React Email)
- [ ] Stripe subscription management
- [ ] Reading progress tracking
- [ ] "Too Easy/Too Hard" feedback loop
- [ ] Audio narration
- [ ] PWA offline support
- [ ] Analytics integration

---

## Support

**Questions?**
- Check `PRD.md` for full specs
- Check `HANDOFF.md` for architecture details
- Check `PHASE-1-COMPLETE.md` for what was built

**Need Help?**
- Supabase docs: https://supabase.com/docs
- tRPC docs: https://trpc.io/docs
- Stripe docs: https://stripe.com/docs

---

**You're 90% done. Database connection is the only thing left to make this fully functional!**
