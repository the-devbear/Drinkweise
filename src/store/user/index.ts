import { storage } from '@drinkweise/lib/storage/mmkv';
import { signInWithAppleAction } from '@drinkweise/store/user/actions/sign-in-with-apple.action';
import { signInWithGoogleAction } from '@drinkweise/store/user/actions/sign-in-with-google.action';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { signInWithPasswordAction } from './actions/sign-in-with-password.action';
import { signOutAction } from './actions/sign-out.action';
import { signUpWithPasswordAction } from './actions/sign-up-with-password.action';
import { initialUserState, UserState } from './models/user-state.model';
import { userSlice } from './user.slice';

function getInitialUserState(): UserState {
  const userState = storage.getString(userSlice);

  if (!userState) {
    return initialUserState;
  }

  try {
    return JSON.parse(userState);
  } catch {}

  return initialUserState;
}

export const userStateSlice = createSlice({
  name: userSlice,
  initialState: getInitialUserState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          signInWithPasswordAction.fulfilled,
          signUpWithPasswordAction.fulfilled,
          signInWithAppleAction.fulfilled,
          signInWithGoogleAction.fulfilled
        ),
        (_state, { payload: { user, session } }) => ({
          status: 'signedIn',
          user,
          session,
        })
      )
      .addMatcher(
        isAnyOf(
          signInWithPasswordAction.rejected,
          signUpWithPasswordAction.rejected,
          signInWithAppleAction.rejected,
          signInWithGoogleAction.rejected,
          signOutAction.fulfilled,
          signOutAction.rejected
        ),
        () => ({ status: 'signedOut' })
      );
  },
});
