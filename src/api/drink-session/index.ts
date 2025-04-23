import { supabase } from '@drinkweise/lib/supabase';

import { DrinkSessionService } from './services/drink-session.service';

export const drinkSessionService = new DrinkSessionService(supabase);
