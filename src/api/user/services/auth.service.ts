import type { Failure, Result } from '@drinkweise/lib/types/result.types';
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

export class AuthService implements IAuthService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async signInWithGoogle(): Result<
    SignInSuccessResponseModel,
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
          user: userData,
          session: {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresIn: data.session.expires_in,
            expiresAt: data.session.expires_at,
          },
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

      if (this.hasErrorMessage(error)) {
        return { error: { message: error.message } };
      }

      console.error('Error signing in with Google', error);
      return { error: { message: 'An unexpected error happened' } };
    }
  }

  public async signInWithApple(): Result<
    SignInSuccessResponseModel,
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
          user: userData,
          session: {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresIn: data.session.expires_in,
            expiresAt: data.session.expires_at,
          },
        },
      };
    } catch (error) {
      if (isCodedError(error)) {
        return { error };
      }
      if (this.hasErrorMessage(error)) {
        return { error: { message: error.message } };
      }
      return { error: { message: 'An unexpected error happened' } };
    }
  }

  public async signInWithPassword(
    email: string,
    password: string
  ): Result<SignInSuccessResponseModel, AuthError | PostgrestError> {
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
        user: userData,
        session: {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresIn: authData.session.expires_in,
          expiresAt: authData.session.expires_at,
        },
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
        user: userData,
        session: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresIn: session.expires_in,
          expiresAt: session.expires_at,
        },
      },
    };
  }

  public async signOut(): Promise<Failure<AuthError> | undefined> {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      console.error('Error signing out', error);
      return { error };
    }
  }

  private async getUserData(
    id: string
  ): Result<SignInSuccessResponseModel['user'], PostgrestError> {
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
        id,
        username: data.username,
        profilePicture: data.profile_picture ?? undefined,
        height: data.height,
        weight: data.weight,
        gender: data.gender ?? undefined,
        hasCompletedOnboarding: data.has_completed_onboarding,
      },
    };
  }

  private hasErrorMessage(error: unknown): error is { message: string } {
    return !!error && typeof error === 'object' && 'message' in error;
  }
}
