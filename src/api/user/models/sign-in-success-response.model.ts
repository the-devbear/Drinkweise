export interface SignInSuccessResponseModel {
  user: {
    id: string;
    username: string;
    profilePicture?: string;
    height: number;
    weight: number;
    gender?: 'male' | 'female' | 'other';
    hasCompletedOnboarding: boolean;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    expiresAt?: number;
  };
}
