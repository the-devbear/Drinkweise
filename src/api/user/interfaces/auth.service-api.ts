import type { Result } from '@drinkweise/lib/types/result.types';

import type { SignInSuccessResponseModel } from '../models/sign-in-success-response.model';

export interface IAuthService {
  signInWithPassword(email: string, password: string): Result<SignInSuccessResponseModel>;
  signInWithApple(): Result<SignInSuccessResponseModel>;
  signInWithGoogle(): Result<SignInSuccessResponseModel>;
  signUpWithPassword(email: string, password: string): Result<SignInSuccessResponseModel>;
}
