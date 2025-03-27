import { supabase } from '@drinkweise/lib/supabase';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

export const authService = new AuthService(supabase);
export const userService = new UserService(supabase);
