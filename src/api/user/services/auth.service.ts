import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';

import type { IAuthService } from '../interfaces/auth.service-api';
import type { UserModel } from '../models/user.model';

export class AuthService implements IAuthService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async signInWithPassword(
    email: string,
    password: string
  ): Result<UserModel, AuthError | PostgrestError> {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { error: authError };
    }

    const id = authData.user.id;

    const { value: userData, error: userError } = await this.getUserData(id);

    if (userError) {
      return { error: userError };
    }

    return {
      value: {
        id,
        email,
        ...userData,
      },
    };
  }

  public async signUpWithPassword(
    email: string,
    password: string
  ): Result<UserModel, AuthError | PostgrestError | Error> {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { error: authError };
    }

    if (!authData.session || !authData.user) {
      return { error: new Error('No session or user data returned') };
    }

    const id = authData.session.user.id || authData.user.id;

    const { value: userData, error: userError } = await this.getUserData(id);

    if (userError) {
      return { error: userError };
    }

    return {
      value: {
        id,
        email,
        ...userData,
      },
    };
  }

  private async getUserData(
    id: string
  ): Result<
    Pick<
      UserModel,
      'username' | 'profilePicture' | 'height' | 'weight' | 'gender' | 'hasCompletedOnboarding'
    >,
    PostgrestError
  > {
    const { data, error } = await this.supabase
      .from('users')
      .select('username, profile_picture, height, weight, gender, has_completed_onboarding')
      .eq('id', id)
      .single();

    if (error) {
      return { error };
    }

    return {
      value: {
        username: data.username,
        profilePicture: data.profile_picture ?? undefined,
        height: data.height,
        weight: data.weight,
        gender: data.gender ?? undefined,
        hasCompletedOnboarding: data.has_completed_onboarding,
      },
    };
  }
}
