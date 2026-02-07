import { router, protectedProcedure } from '../init';
import { z } from 'zod';

export const childrenRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      // TODO: Implement
      return [];
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
      readingLevel: z.enum(['early', 'independent', 'confident', 'advanced']),
      readingLevelSource: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement
      return null;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(50).optional(),
      readingLevel: z.enum(['early', 'independent', 'confident', 'advanced']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement
      return null;
    }),
});
