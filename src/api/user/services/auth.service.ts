import { Result } from '@drinkweise/lib/types/result.types';

import { IAuthService } from '../interfaces/auth.service-api';
import { UserModel } from '../models/user.model';

export class AuthService implements IAuthService {
  public async signInWithPassword(email: string, password: string): Result<UserModel> {
    throw new Error(`Method not implemented. ${email} ${password}`);
  }
  public async signUpWithPassword(email: string, password: string): Result<UserModel> {
    throw new Error(`Method not implemented. ${email} ${password}`);
  }
}
