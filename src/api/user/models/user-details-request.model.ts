export interface UserDetailsRequestModel {
  username: string;
  height: number;
  weight: number;
  gender?: 'male' | 'female' | 'other';
  profilePicture?: string;
}
