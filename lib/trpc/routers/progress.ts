import { router, protectedProcedure } from '../init';
import { z } from 'zod';

export const progressRouter = router({
  get: protectedProcedure
    .input(z.object({
      childId: z.string().uuid(),
      storyId: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      // TODO: Implement
      return null;
    }),

  update: protectedProcedure
    .input(z.object({
      childId: z.string().uuid(),
      storyId: z.string().uuid(),
      currentChapter: z.number().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement
      return null;
    }),

  complete: protectedProcedure
    .input(z.object({
      childId: z.string().uuid(),
      storyId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement
      return null;
    }),
});
