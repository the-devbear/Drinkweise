import { Result } from '@drinkweise/lib/types/result.types';

import { UserModel } from '../models/user.model';

export interface IAuthService {
  signInWithPassword(email: string, password: string): Result<UserModel>;
  signUpWithPassword(email: string, password: string): Result<UserModel>;
}
