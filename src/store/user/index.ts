import { storage } from '@drinkweise/lib/storage/mmkv';
import { signInWithAppleAction } from '@drinkweise/store/user/actions/sign-in-with-apple.action';
import { signInWithGoogleAction } from '@drinkweise/store/user/actions/sign-in-with-google.action';
import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

import { completeOnboardingAction } from './actions/complete-onboarding.action';
import { signInWithPasswordAction } from './actions/sign-in-with-password.action';
import { signOutAction } from './actions/sign-out.action';
import { signUpWithPasswordAction } from './actions/sign-up-with-password.action';
import { updateUserDataAction, uploadUserProfilePictureFromUriAction } from './actions/update-user-data.action';
import type { SessionModel } from './models/session.model';
import { initialUserState, type UserState } from './models/user-state.model';
import { userSlice } from './user.slice';

function getInitialUserState(): UserState {
  const userState = storage.getString(userSlice);

  if (!userState) {
    return initialUserState;
  }

  try {
    // TODO: Check if the data is of the correct type
    return JSON.parse(userState);
  } catch (e) {
    console.error(e);
  }

  return initialUserState;
}

export const userStateSlice = createSlice({
  name: userSlice,
  initialState: getInitialUserState(),
  reducers: {
    updateUserSession: (state, action: PayloadAction<{ session: SessionModel }>) => {
      if (state.status !== 'signedIn') {
        return;
      }

      state.session = action.payload.session;
    },
    supabaseSignOut: () => initialUserState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        completeOnboardingAction.fulfilled,
        (state, { payload: { username, weight, height, gender } }) => {
          if (state.status !== 'signedIn') {
            return;
          }
          state.user.username = username;
          state.user.height = height;
          state.user.weight = weight;
          state.user.gender = gender;
          state.user.hasCompletedOnboarding = true;
        }
      )
      .addCase(updateUserDataAction.fulfilled, (state, { payload }) => {
        if (state.status === 'signedOut') {
          return state;
        }

        state.user = {
          ...state.user,
          ...payload,
        };
      })
      .addCase(uploadUserProfilePictureFromUriAction.fulfilled, (state, { payload }) => {
        if (state.status !== 'signedIn') {
          return;
        }
        state.user.profilePicture = payload.profilePicture;
      })
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
  selectors: {
    userSelector: (state) => state.user,
    userSessionSelector: (state) => state.session,
    userWeightSelector: (state) => state.user?.weight,
    userIdSelector: (state) => state.user?.id,
  },
});

export const {
  updateUserSession: updateUserSessionAction,
  supabaseSignOut: supabaseSignOutAction,
} = userStateSlice.actions;
export const { userSelector, userSessionSelector, userWeightSelector, userIdSelector } =
  userStateSlice.selectors;
