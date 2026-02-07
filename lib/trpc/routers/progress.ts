import { router, protectedProcedure } from '../init';
import { z } from 'zod';
import { db } from '@/lib/db';
import { readingProgress, children } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const progressRouter = router({
  get: protectedProcedure
    .input(z.object({
      childId: z.string().uuid(),
      storyId: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      // Verify child belongs to user
      const [child] = await db
        .select()
        .from(children)
        .where(and(
          eq(children.id, input.childId),
          eq(children.parentId, ctx.user.id)
        ))
        .limit(1);

      if (!child) {
        throw new Error('Child not found or access denied');
      }

      const [progress] = await db
        .select()
        .from(readingProgress)
        .where(and(
          eq(readingProgress.childId, input.childId),
          eq(readingProgress.storyId, input.storyId)
        ))
        .limit(1);

      return progress || null;
    }),

  update: protectedProcedure
    .input(z.object({
      childId: z.string().uuid(),
      storyId: z.string().uuid(),
      currentChapter: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify child belongs to user
      const [child] = await db
        .select()
        .from(children)
        .where(and(
          eq(children.id, input.childId),
          eq(children.parentId, ctx.user.id)
        ))
        .limit(1);

      if (!child) {
        throw new Error('Child not found or access denied');
      }

      // Check if progress record exists
      const [existing] = await db
        .select()
        .from(readingProgress)
        .where(and(
          eq(readingProgress.childId, input.childId),
          eq(readingProgress.storyId, input.storyId)
        ))
        .limit(1);

      if (existing) {
        // Update existing record
        const [updated] = await db
          .update(readingProgress)
          .set({
            currentChapter: input.currentChapter,
            lastReadAt: sql`now()`,
          })
          .where(and(
            eq(readingProgress.childId, input.childId),
            eq(readingProgress.storyId, input.storyId)
          ))
          .returning();

        return updated;
      } else {
        // Create new record
        const [created] = await db
          .insert(readingProgress)
          .values({
            childId: input.childId,
            storyId: input.storyId,
            currentChapter: input.currentChapter,
          })
          .returning();

        return created;
      }
    }),

  complete: protectedProcedure
    .input(z.object({
      childId: z.string().uuid(),
      storyId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify child belongs to user
      const [child] = await db
        .select()
        .from(children)
        .where(and(
          eq(children.id, input.childId),
          eq(children.parentId, ctx.user.id)
        ))
        .limit(1);

      if (!child) {
        throw new Error('Child not found or access denied');
      }

      // Check if progress record exists
      const [existing] = await db
        .select()
        .from(readingProgress)
        .where(and(
          eq(readingProgress.childId, input.childId),
          eq(readingProgress.storyId, input.storyId)
        ))
        .limit(1);

      if (existing) {
        // Update existing record
        const [updated] = await db
          .update(readingProgress)
          .set({
            completed: true,
            completedAt: sql`now()`,
            lastReadAt: sql`now()`,
          })
          .where(and(
            eq(readingProgress.childId, input.childId),
            eq(readingProgress.storyId, input.storyId)
          ))
          .returning();

        return updated;
      } else {
        // Create new record as completed
        const [created] = await db
          .insert(readingProgress)
          .values({
            childId: input.childId,
            storyId: input.storyId,
            completed: true,
            completedAt: sql`now()`,
          })
          .returning();

        return created;
      }
    }),

  listForChild: protectedProcedure
    .input(z.object({
      childId: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      // Verify child belongs to user
      const [child] = await db
        .select()
        .from(children)
        .where(and(
          eq(children.id, input.childId),
          eq(children.parentId, ctx.user.id)
        ))
        .limit(1);

      if (!child) {
        throw new Error('Child not found or access denied');
      }

      const progressList = await db
        .select()
        .from(readingProgress)
        .where(eq(readingProgress.childId, input.childId))
        .orderBy(readingProgress.lastReadAt);

      return progressList;
    }),
});
