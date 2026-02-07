import { router, publicProcedure } from '../init';
import { z } from 'zod';
import { db } from '@/lib/db';
import { stories, chapters } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export const storiesRouter = router({
  listPublished: publicProcedure
    .input(z.object({
      readingLevel: z.enum(['early', 'independent', 'confident', 'advanced']).optional(),
      genre: z.string().optional(),
      virtue: z.string().optional(),
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      // Build where conditions
      const conditions = [eq(stories.status, 'published')];
      
      if (input.readingLevel) {
        conditions.push(eq(stories.readingLevel, input.readingLevel));
      }
      
      if (input.genre) {
        conditions.push(eq(stories.genre, input.genre));
      }
      
      if (input.virtue) {
        conditions.push(eq(stories.primaryVirtue, input.virtue));
      }

      // Query stories
      const storyList = await db
        .select()
        .from(stories)
        .where(and(...conditions))
        .orderBy(desc(stories.publishedAt))
        .limit(input.limit)
        .offset(input.offset);

      // Get total count for pagination
      const [countResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(stories)
        .where(and(...conditions));

      return {
        stories: storyList,
        total: countResult?.count || 0,
      };
    }),

  getById: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const [story] = await db
        .select()
        .from(stories)
        .where(eq(stories.id, input.id))
        .limit(1);

      if (!story) return null;

      // Get chapters for this story
      const storyChapters = await db
        .select()
        .from(chapters)
        .where(eq(chapters.storyId, input.id))
        .orderBy(chapters.chapterNumber);

      return {
        ...story,
        chapters: storyChapters,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const [story] = await db
        .select()
        .from(stories)
        .where(eq(stories.slug, input.slug))
        .limit(1);

      if (!story) return null;

      // Get chapters for this story
      const storyChapters = await db
        .select()
        .from(chapters)
        .where(eq(chapters.storyId, story.id))
        .orderBy(chapters.chapterNumber);

      return {
        ...story,
        chapters: storyChapters,
      };
    }),
});
