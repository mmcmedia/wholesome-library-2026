import { router, protectedProcedure } from '../init';
import { z } from 'zod';

export const preferencesRouter = router({
  get: protectedProcedure
    .input(z.object({
      childId: z.string().uuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      // TODO: Implement
      return null;
    }),

  update: protectedProcedure
    .input(z.object({
      childId: z.string().uuid().optional(),
      includeFantasyMagic: z.boolean().optional(),
      includeMildConflict: z.boolean().optional(),
      includeFaithThemes: z.boolean().optional(),
      includeSupernatural: z.boolean().optional(),
      excludedThemes: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement
      return null;
    }),
});
