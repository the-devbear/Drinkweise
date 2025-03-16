import { Result } from '@drinkweise/lib/types/result.types';

import { SignInSuccessResponseModel } from '../models/sign-in-success-response.model';
import { UserModel } from '../models/user.model';

export interface IAuthService {
  signInWithPassword(email: string, password: string): Result<UserModel>;
  signInWithApple(): Result<UserModel>;
  signInWithGoogle(): Result<UserModel>;
  signUpWithPassword(email: string, password: string): Result<SignInSuccessResponseModel>;
}
