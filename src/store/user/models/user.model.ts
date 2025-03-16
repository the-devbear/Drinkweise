import type { Gender } from '../enums/gender';

export interface UserModel {
  id: string;
  username: string;
  profilePicture?: string;
  height: number;
  weight: number;
  gender?: Gender;
  hasCompletedOnboarding: boolean;
}
