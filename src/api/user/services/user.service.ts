import type { Failure } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import type { PostgrestError } from '@supabase/supabase-js';

import type { IUserService } from '../interfaces/user.service-api';
import type { UserDetailsRequestModel } from '../models/user-details-request.model';

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
}
