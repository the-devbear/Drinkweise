import { supabaseStorage } from '@drinkweise/lib/storage/mmkv';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import { Env } from '@env';
import { createClient } from '@supabase/supabase-js';

export const supabase: TypedSupabaseClient = createClient(Env.SUPABASE_URL, Env.SUPABASE_ANON_KEY, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
