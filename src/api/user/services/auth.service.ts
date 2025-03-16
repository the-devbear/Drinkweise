import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import { isCodedError } from '@drinkweise/lib/utils/error/is-coded-error';
import {
  GoogleSignin,
  isErrorWithCode as isGoogleSignInError,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import type { AuthError, PostgrestError } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import type { CodedError } from 'expo-modules-core';

import type { IAuthService } from '../interfaces/auth.service-api';
import type { SignInSuccessResponseModel } from '../models/sign-in-success-response.model';
import type { UserModel } from '../models/user.model';

export class AuthService implements IAuthService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async signInWithGoogle(): Result<
    UserModel,
    AuthError | PostgrestError | { message: string; type: 'cancelled' } | { message: string }
  > {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.type === 'cancelled') {
        return { error: { message: 'Google sign in cancelled', type: 'cancelled' } };
      }

      if (!userInfo.data?.idToken) {
        return { error: { message: 'No ID token returned' } };
      }

      const { data, error } = await this.supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });

      if (error) {
        return { error };
      }

      const { value: userData, error: userError } = await this.getUserData(data.user.id);

      if (userError) {
        return { error: userError };
      }

      return {
        value: {
          id: data.user.id,
          email: userInfo.data.user.email,
          ...userData,
        },
      };
    } catch (error) {
      if (isGoogleSignInError(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            return { error: { message: 'Google sign in cancelled', type: 'cancelled' } };
          case statusCodes.IN_PROGRESS:
            return { error: { message: 'Google sign in in progress' } };
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            return { error: { message: 'Play services not available' } };
          case statusCodes.SIGN_IN_REQUIRED:
            return { error: { message: 'Sign in required' } };
        }
      }
      return { error: { message: 'An unexpected error happened' } };
    }
  }

  public async signInWithApple(): Result<
    UserModel,
    AuthError | PostgrestError | CodedError | { message: string }
  > {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      if (!credential.identityToken) {
        return { error: { message: 'No identity token returned' } };
      }

      const { data, error } = await this.supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        return { error };
      }

      const { value: userData, error: userError } = await this.getUserData(data.user.id);

      if (userError) {
        return { error: userError };
      }

      return {
        value: {
          id: data.user.id,
          email: credential.email!,
          ...userData,
        },
      };
    } catch (error) {
      if (isCodedError(error)) {
        return { error };
      }
      return { error: { message: 'An unexpected error happened' } };
    }
  }

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
  ): Result<SignInSuccessResponseModel, AuthError | PostgrestError | Error> {
    const {
      data: { session },
      error: authError,
    } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { error: authError };
    }

    if (!session) {
      return { error: new Error('No session returned') };
    }

    const id = session.user.id;

    const { value: userData, error: userError } = await this.getUserData(id);

    if (userError) {
      return { error: userError };
    }

    return {
      value: {
        user: {
          id,
          ...userData,
        },
        session: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresIn: session.expires_in,
          expiresAt: session.expires_at,
        },
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
