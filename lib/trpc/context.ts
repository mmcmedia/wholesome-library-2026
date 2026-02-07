import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

export async function createContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return {
    supabase,
    user: user || null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
