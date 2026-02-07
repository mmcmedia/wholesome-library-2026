import { router, publicProcedure, protectedProcedure } from '../init';

export const authRouter = router({
  getSession: publicProcedure
    .query(async ({ ctx }) => {
      return {
        user: ctx.user,
      };
    }),

  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      // TODO: Fetch profile from database
      return null;
    }),
});
