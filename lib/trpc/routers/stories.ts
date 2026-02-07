import { router, publicProcedure } from '../init';
import { z } from 'zod';

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
      // TODO: Implement with Drizzle query
      return {
        stories: [],
        total: 0,
      };
    }),

  getById: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      // TODO: Implement with Drizzle query
      return null;
    }),

  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // TODO: Implement with Drizzle query
      return null;
    }),
});
