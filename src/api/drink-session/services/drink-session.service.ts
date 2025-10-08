import { NoDrinkSessionFoundError } from '@drinkweise/api/drink-session/errors/no-drink-session-found.error';
import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import type { PostgrestError } from '@supabase/supabase-js';

import type { IDrinkSessionService } from '../interfaces/drink-session.service-api';
import type { CompleteDrinkSessionRequestModel } from '../models/complete-drink-session-request.model';
import type { DrinkSessionResponse } from '../models/drink-session.response';
import type { PaginatedDrinkSessionResponse } from '../models/paginated-drink-session.response';

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
  ): Result<PaginatedDrinkSessionResponse[], PostgrestError> {
    let query = this.supabase
      .from('drink_sessions')
      .select('id, user_id, name, note, start_time, end_time, users(username)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(this.DEFAULT_PAGE_SIZE);

    if (cursor) {
      query = query.lt('start_time', cursor);
    }

    const { data, error } = await query;

    if (error) {
      return { error };
    }
    if (!data) {
      return { value: [] };
    }

    const drinkSessions = data.map((session) => ({
      id: session.id,
      name: session.name,
      note: session.note ?? undefined,
      userName: session.users.username,
      startTime: session.start_time,
      endTime: session.end_time,
    }));

    return { value: drinkSessions };
  }

  public async getDrinkSessionById(
    drinkSessionId: string,
    abortSignal: AbortSignal
  ): Result<DrinkSessionResponse, PostgrestError | NoDrinkSessionFoundError> {
    const { data, error } = await this.supabase
      .from('drink_sessions')
      .select(
        `
          id,
          name,
          note,
          start_time,
          end_time,
          user:users (
            username,
            height,
            weight,
            gender,
            profile_picture
          ),
          consumptions (
            id,
            volume,
            start_time,
            end_time,
            drink:drinks (
              name,
              alcohol,
              type
            )
          )
      `
      )
      .eq('id', drinkSessionId)
      .order('start_time', { ascending: true, referencedTable: 'consumptions' })
      .abortSignal(abortSignal)
      .single();

    if (error) {
      return { error };
    }

    if (!data) {
      return { error: NoDrinkSessionFoundError.fromId(drinkSessionId) };
    }

    const mappedData: DrinkSessionResponse = {
      id: data.id,
      name: data.name,
      note: data.note ?? undefined,
      user: {
        userName: data.user.username,
        height: data.user.height,
        weight: data.user.weight,
        gender: data.user.gender ?? undefined,
        profilePictureUrl: data.user.profile_picture ?? undefined,
      },
      startTime: data.start_time,
      endTime: data.end_time,
      consumptions: data.consumptions.map((consumption) => ({
        id: consumption.id,
        name: consumption.drink.name,
        type: consumption.drink.type,
        alcohol: consumption.drink.alcohol,
        volume: consumption.volume,
        startTime: consumption.start_time,
        endTime: consumption.end_time,
      })),
    };

    return {
      value: mappedData,
    };
  }

  public async getSessionCountByUserId(userId: string): Result<number, PostgrestError> {
    const { count, error } = await this.supabase
      .from('drink_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      return { error };
    }

    return { value: count ?? 0 };
  }
}
