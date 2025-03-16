import type { ActionCasesBuilderHelper } from '@drinkweise/lib/types/redux/action-cases-builder-helper';
import { createSlice } from '@reduxjs/toolkit';

import { signUpWithPasswordAction } from './actions/sign-up-with-password.action';
import { initialUserState, type UserState } from './models/user-state.model';
import { userSlice } from './user.slice';

type UserActionCasesBuilder = ActionCasesBuilderHelper<UserState>;

const signUpWithPasswordActionCases: UserActionCasesBuilder = (builder) =>
  builder
    .addCase(signUpWithPasswordAction.fulfilled, (_state, { payload: { user, session } }) => ({
      status: 'signedIn',
      user,
      session,
    }))
    .addCase(signUpWithPasswordAction.rejected, () => ({ status: 'signedOut' }));

export const userStateSlice = createSlice({
  name: userSlice,
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    signUpWithPasswordActionCases(builder);
  },
});
