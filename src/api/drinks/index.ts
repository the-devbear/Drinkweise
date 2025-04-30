import { DrinksService } from '@drinkweise/api/drinks/services/drinks.service';
import { supabase } from '@drinkweise/lib/supabase';

export const drinksService = new DrinksService(supabase);
