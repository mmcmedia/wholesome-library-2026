import { router, protectedProcedure } from '../init';
import { z } from 'zod';
import { db } from '@/lib/db';
import { children } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const childrenRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const childList = await db
        .select()
        .from(children)
        .where(eq(children.parentId, ctx.user.id));

      return childList;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
      readingLevel: z.enum(['early', 'independent', 'confident', 'advanced']),
      readingLevelSource: z.string().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [newChild] = await db
        .insert(children)
        .values({
          parentId: ctx.user.id,
          name: input.name,
          readingLevel: input.readingLevel,
          readingLevelSource: input.readingLevelSource || 'parent_selected',
          avatarUrl: input.avatarUrl,
        })
        .returning();

      return newChild;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(50).optional(),
      readingLevel: z.enum(['early', 'independent', 'confident', 'advanced']).optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      // Verify ownership
      const [child] = await db
        .select()
        .from(children)
        .where(and(
          eq(children.id, id),
          eq(children.parentId, ctx.user.id)
        ))
        .limit(1);

      if (!child) {
        throw new Error('Child not found or access denied');
      }

      const [updatedChild] = await db
        .update(children)
        .set(updates)
        .where(eq(children.id, id))
        .returning();

      return updatedChild;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const [child] = await db
        .select()
        .from(children)
        .where(and(
          eq(children.id, input.id),
          eq(children.parentId, ctx.user.id)
        ))
        .limit(1);

      if (!child) {
        throw new Error('Child not found or access denied');
      }

      await db
        .delete(children)
        .where(eq(children.id, input.id));

      return { success: true };
    }),
});
