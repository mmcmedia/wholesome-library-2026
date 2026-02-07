# Wholesome Library v2 — Story Generation Pipeline

**Independent story generation system for Wholesome Library v2.**

This pipeline is SEPARATE from the Next.js web app. It runs as a standalone worker that:
1. Pulls story briefs from the queue
2. Generates stories using AI
3. Runs quality/safety/values checks
4. Queues stories for editor review

---

## Architecture

```
Brief → DNA → Chapters → AI Edit → QA Checks → Editor Queue
```

### Pipeline Stages

1. **DNA Generation** (3-stage sequential)
   - Foundation (world, themes, plot)
   - Characters & relationships
   - Chapter specs & continuity

2. **Chapter Drafting**
   - Sequential generation using DNA + chapter specs
   - Each chapter uses previous ending for continuity

3. **AI Editor Pass**
   - Fixes grammar, spelling, artifacts
   - Smooths transitions
   - Flags (doesn't fix) values concerns

4. **Quality Check** (0-100 score)
   - Narrative coherence (25 pts)
   - Character consistency (20 pts)
   - Age appropriateness (20 pts)
   - Engagement (20 pts)
   - Technical quality (15 pts)

5. **Safety Scan** (binary pass/fail)
   - Violence, death, mature content checks
   - Any fail = auto-reject

6. **Values Check** (1-5 scale)
   - Role models, consequences, conflict resolution
   - Average < 3.0 = flagged

7. **Cover Generation**
   - Nano Banana (kie.ai) async workflow
   - Falls back to genre template if fails

---

## File Structure

```
generation/
├── types/
│   └── index.ts           # Type definitions
├── utils/
│   ├── supabase.ts        # Supabase client
│   ├── openai.ts          # OpenAI client with retry
│   └── logger.ts          # Pipeline logger
├── lib/
│   ├── story-creator.ts   # DNA + chapter generation
│   ├── brief-manager.ts   # Queue management
│   ├── quality-check.ts   # Quality scoring
│   ├── safety-scan.ts     # Safety checks
│   ├── values-check.ts    # Values alignment
│   ├── ai-editor.ts       # Polish pass
│   └── cover-generator.ts # Cover art via Nano Banana
├── pipeline.ts            # Main orchestrator
├── run.ts                 # Entry point
├── package.json
├── tsconfig.json
└── .env
```

---

## Setup

```bash
cd /Users/mmcassistant/clawd/projects/wholesome-library-2026/generation
npm install
```

---

## Usage

### Run pipeline once (process next queued brief)
```bash
npm run generate
```

### Auto-generate briefs + process one
```bash
npm run auto-generate
```

### Manual run
```bash
npx tsx run.ts
```

---

## Environment Variables

See `.env.example` for required vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `KIE_AI_API_KEY`

---

## Models Used

- **DNA Generation:** `gpt-4o-mini` (cheaper, fast, structured)
- **Chapter Generation:** `gpt-5.2` (high quality prose)
- **QA Checks:** `gpt-4o-mini` (cheap for scoring)
- **AI Editor:** `gpt-5.2` (quality editing)
- **Cover Art:** `google/nano-banana` (2¢/image via kie.ai)

---

## Quality Thresholds (Per PRD)

| Score | Action |
|-------|--------|
| 85+ | Auto-approve to editor queue (skim review) |
| 70-84 | Editor queue (spot check or full review) |
| < 70 | Auto-reject, brief recycled |

**Safety:** ANY fail = auto-reject  
**Values:** Average < 3.0 = flagged for review

---

## Cron Setup (Future)

Add to crontab to run hourly:
```bash
0 * * * * cd /path/to/generation && npm run generate >> /tmp/generation.log 2>&1
```

---

## Reference

- **PRD Sections 8 & 9:** `/projects/wholesome-library-v2/PRD.md`
- **Database Schema:** `/lib/db/schema.ts`
- **Old V3 Pipeline:** `/projects/wholesome2.0/lib/services/V3StoryCreatorEnhanced.ts`
- **Sequential DNA:** `/projects/wholesome2.0/lib/services/enhanced-story-dna-sequential.ts`

---

## Notes

- Uses proven V3 logic from the old pipeline
- Independent from the Next.js app (can run separately)
- All files written to `generation/` directory only
- Uses `gpt-5.2` (NOT `gpt-4o` which is deprecated)
- Cover art uses Nano Banana async workflow (documented in TOOLS.md)
