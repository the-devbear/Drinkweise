import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import type { PostgrestError } from '@supabase/supabase-js';

import type { IDrinkSessionService } from '../interfaces/drink-session.service-api';
import type { CompleteDrinkSessionRequestModel } from '../models/complete-drink-session-request.model';
import type { DrinkSessionResponse } from '../models/drink-session.response';

export class DrinkSessionService implements IDrinkSessionService {
  public readonly DEFAULT_PAGE_SIZE = 20;

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

  public async getPaginatedDrinkSessionsByUserId(
    userId: string,
    cursor: string
  ): Result<DrinkSessionResponse[], PostgrestError> {
    let query = this.supabase
      .from('drink_sessions')
      .select('id, user_id, name, note, start_time, end_time, users(username)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(this.DEFAULT_PAGE_SIZE);

    if (cursor) {
      query = query.lt('start_time', cursor);
    }

    const { data, error } = await query.limit(10);

    if (error) {
      return { error };
    }
    if (!data) {
      return { value: [] };
    }

    const drinkSessions = data.map((session) => ({
      id: session.id,
      name: session.name,
      note: session.note,
      userName: session.users.username,
      startTime: session.start_time,
      endTime: session.end_time,
    }));

    return { value: drinkSessions };
  }
}
