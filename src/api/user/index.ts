import { supabase } from '@drinkweise/lib/supabase';

import { AuthService } from './services/auth.service';

export const authService = new AuthService(supabase);
