import type { SessionModel } from './session.model';
import type { UserModel } from './user.model';

export interface SignedOutUserState {
  status: 'signedOut';
  user?: undefined;
  session?: undefined;
}

export interface SignedInUserState {
  status: 'signedIn';
  user: UserModel;
  session: SessionModel;
}

export type UserState = SignedInUserState | SignedOutUserState;

export const initialUserState = {
  status: 'signedOut',
} satisfies UserState as UserState;
