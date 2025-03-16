export interface SessionModel {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt?: number;
}
