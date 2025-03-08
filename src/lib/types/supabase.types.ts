import type { Database } from '@drinkweise/lib/types/generated/supabase.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type TypedSupabaseClient = SupabaseClient<Database>;
