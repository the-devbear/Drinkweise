import type { Failure } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import type { PostgrestError } from '@supabase/supabase-js';

import { UserProfileNotUpdated } from '../errors/user-profile-not-updated.error';
import type { IUserService } from '../interfaces/user.service-api';
import type { UserDetailsRequestModel } from '../models/user-details-request.model';
import type { UserNotificationPreferencesRequestModel } from '../models/user-notification-preferences-request.model';

export class UserService implements IUserService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async completeOnboarding(
    userId: string,
    userDetails: UserDetailsRequestModel
  ): Promise<Failure<PostgrestError> | undefined> {
    const { error } = await this.supabase
      .from('users')
      .update({
        username: userDetails.username,
        height: userDetails.height,
        weight: userDetails.weight,
        gender: userDetails.gender,
        has_completed_onboarding: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { error };
    }
  }

  public async updateProfile(
    userId: string,
    userDetails: Partial<UserDetailsRequestModel>
  ): Promise<Failure<PostgrestError | UserProfileNotUpdated> | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .update({
        username: userDetails.username,
        height: userDetails.height,
        weight: userDetails.weight,
        gender: userDetails.gender,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id');

    if (error) {
      return { error };
    }

    if (!data || data.length === 0) {
      return { error: UserProfileNotUpdated.fromEmpty() };
    }
  }

  public async updateNotificationPreferences(
    userId: string,
    notificationSettings: UserNotificationPreferencesRequestModel
  ): Promise<Failure<PostgrestError> | undefined> {
    const { error } = await this.supabase
      .from('users')
      .update({
        notification_preferences: JSON.stringify(notificationSettings),
      })
      .eq('id', userId);

    if (error) {
      return { error };
    }
  }
}
