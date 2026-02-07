import { router } from '../init';
import { storiesRouter } from './stories';
import { authRouter } from './auth';
import { childrenRouter } from './children';
import { progressRouter } from './progress';
import { preferencesRouter } from './preferences';
import { adminRouter } from './admin';

export const appRouter = router({
  stories: storiesRouter,
  auth: authRouter,
  children: childrenRouter,
  progress: progressRouter,
  preferences: preferencesRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
