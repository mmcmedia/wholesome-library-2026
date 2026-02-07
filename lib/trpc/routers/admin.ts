import { router, adminProcedure } from '../init';
import { z } from 'zod';

export const adminRouter = router({
  queue: router({
    list: adminProcedure
      .query(async ({ ctx }) => {
        // TODO: Implement - get stories in editor_queue status
        return [];
      }),

    approve: adminProcedure
      .input(z.object({
        storyId: z.string().uuid(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement - approve story, change status to published
        return null;
      }),

    reject: adminProcedure
      .input(z.object({
        storyId: z.string().uuid(),
        reason: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement - reject story
        return null;
      }),
  }),

  library: router({
    list: adminProcedure
      .query(async ({ ctx }) => {
        // TODO: Implement - get all published stories
        return [];
      }),

    update: adminProcedure
      .input(z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        blurb: z.string().optional(),
        contentTags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement
        return null;
      }),
  }),

  stats: router({
    generation: adminProcedure
      .query(async ({ ctx }) => {
        // TODO: Implement - generation pipeline stats
        return {
          queueDepth: 0,
          storiesGeneratedToday: 0,
          passRate: 0,
        };
      }),
  }),
});
