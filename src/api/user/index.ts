import { AuthService } from './services/auth.service';

export { UserModel } from './models/user.model';
export { Gender, Genders } from './enums/gender';

export const authService = new AuthService();
