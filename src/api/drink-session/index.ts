import { supabase } from '@drinkweise/lib/supabase';

import type { IDrinkSessionService } from './interfaces/drink-session.service-api';
import { DrinkSessionService } from './services/drink-session.service';

export const drinkSessionService: IDrinkSessionService = new DrinkSessionService(supabase);
