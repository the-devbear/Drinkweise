import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';

import type { IDrinkSessionService } from '../interfaces/drink-session.service-api';
import type { CompleteDrinkSessionRequestModel } from '../models/complete-drink-session-request.model';

export class DrinkSessionService implements IDrinkSessionService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async completeDrinkSession(drinkSession: CompleteDrinkSessionRequestModel): Result<true> {
    console.log('DrinkSessionService:completeDrinkSession', drinkSession);
    return { value: true };
  }
}
