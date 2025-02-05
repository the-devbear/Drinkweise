import { Env } from '@env';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@drinkweise/lib/types/generated/supabase.types';
import { supabaseStorage } from '@drinkweise/lib/storage/mmkv';

export const supabase = createClient<Database>(Env.SUPABASE_URL, Env.SUPABASE_ANON_KEY, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
