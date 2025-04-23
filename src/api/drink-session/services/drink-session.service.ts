import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import type { PostgrestError } from '@supabase/supabase-js';

import type { IDrinkSessionService } from '../interfaces/drink-session.service-api';
import type { CompleteDrinkSessionRequestModel } from '../models/complete-drink-session-request.model';

export class DrinkSessionService implements IDrinkSessionService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async completeDrinkSession(
    drinkSession: CompleteDrinkSessionRequestModel
  ): Result<true, PostgrestError> {
    const { error } = await this.supabase.rpc('complete_drink_session', {
      name: drinkSession.name,
      note: drinkSession.note,
      start_time: drinkSession.startTime.toISOString(),
      end_time: drinkSession.endTime.toISOString(),
      consumptions: drinkSession.consumptions.map((consumption) => ({
        drink_id: consumption.drinkId,
        volume: consumption.volume,
        start_time: consumption.startTime.toISOString(),
        end_time: consumption.endTime.toISOString(),
      })),
    });

    if (error) {
      console.error('Error completing drink session:', error);
      return { error };
    }

    return { value: true };
  }
}
