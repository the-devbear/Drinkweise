import { signInWithAppleAction } from '@drinkweise/store/user/actions/sign-in-with-apple.action';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { signInWithPasswordAction } from './actions/sign-in-with-password.action';
import { signUpWithPasswordAction } from './actions/sign-up-with-password.action';
import { initialUserState } from './models/user-state.model';
import { userSlice } from './user.slice';

export const userStateSlice = createSlice({
  name: userSlice,
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          signInWithPasswordAction.fulfilled,
          signUpWithPasswordAction.fulfilled,
          signInWithAppleAction.fulfilled
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
          signInWithAppleAction.rejected
        ),
        () => ({ status: 'signedOut' })
      );
  },
});
