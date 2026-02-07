import { router, adminProcedure } from '../init';
import { z } from 'zod';
import { db } from '@/lib/db';
import { stories, editorReviews, storyBriefs } from '@/lib/db/schema';
import { eq, and, desc, sql, gte } from 'drizzle-orm';

export const adminRouter = router({
  queue: router({
    list: adminProcedure
      .query(async ({ ctx }) => {
        // Get stories in editor_queue status with scores
        const queueStories = await db
          .select()
          .from(stories)
          .where(eq(stories.status, 'editor_queue'))
          .orderBy(desc(stories.qualityScore), desc(stories.createdAt));

        return queueStories;
      }),

    approve: adminProcedure
      .input(z.object({
        storyId: z.string().uuid(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update story status to published
        const [updatedStory] = await db
          .update(stories)
          .set({
            status: 'published',
            publishedAt: sql`now()`,
            updatedAt: sql`now()`,
          })
          .where(eq(stories.id, input.storyId))
          .returning();

        // Create editor review record
        await db
          .insert(editorReviews)
          .values({
            storyId: input.storyId,
            reviewerId: ctx.user.id,
            action: 'approved',
            notes: input.notes,
          });

        return updatedStory;
      }),

    reject: adminProcedure
      .input(z.object({
        storyId: z.string().uuid(),
        reason: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update story status to rejected
        const [updatedStory] = await db
          .update(stories)
          .set({
            status: 'rejected',
            rejectionReason: input.reason,
            updatedAt: sql`now()`,
          })
          .where(eq(stories.id, input.storyId))
          .returning();

        // Create editor review record
        await db
          .insert(editorReviews)
          .values({
            storyId: input.storyId,
            reviewerId: ctx.user.id,
            action: 'rejected',
            notes: input.reason,
          });

        return updatedStory;
      }),
  }),

  library: router({
    list: adminProcedure
      .query(async ({ ctx }) => {
        // Get all published stories
        const publishedStories = await db
          .select()
          .from(stories)
          .where(eq(stories.status, 'published'))
          .orderBy(desc(stories.publishedAt));

        return publishedStories;
      }),

    update: adminProcedure
      .input(z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        blurb: z.string().optional(),
        contentTags: z.array(z.string()).optional(),
        coverImageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;

        const [updatedStory] = await db
          .update(stories)
          .set({
            ...updates,
            updatedAt: sql`now()`,
          })
          .where(eq(stories.id, id))
          .returning();

        return updatedStory;
      }),
  }),

  stats: router({
    generation: adminProcedure
      .query(async ({ ctx }) => {
        // Get queue depth (briefs in queued status)
        const [queueResult] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(storyBriefs)
          .where(eq(storyBriefs.status, 'queued'));

        // Get stories generated today
        const [todayResult] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(stories)
          .where(
            gte(stories.createdAt, sql`CURRENT_DATE`)
          );

        // Calculate pass rate (approved vs total reviewed)
        const [totalReviewed] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(stories)
          .where(
            sql`${stories.status} IN ('approved', 'published', 'rejected')`
          );

        const [totalApproved] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(stories)
          .where(
            sql`${stories.status} IN ('approved', 'published')`
          );

        const passRate = totalReviewed.count > 0
          ? (totalApproved.count / totalReviewed.count) * 100
          : 0;

        return {
          queueDepth: queueResult?.count || 0,
          storiesGeneratedToday: todayResult?.count || 0,
          passRate: Math.round(passRate),
        };
      }),
  }),
});
