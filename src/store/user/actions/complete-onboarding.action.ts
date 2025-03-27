import { userService } from '@drinkweise/api/user';
import type { RootState } from '@drinkweise/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { PostgrestError } from '@supabase/supabase-js';

import type { Gender } from '../enums/gender';
import { userSlice } from '../user.slice';

export const completeOnboardingAction = createAsyncThunk<
  {
    username: string;
    height: number;
    weight: number;
    gender?: Gender;
  },
  {
    username: string;
    height: number;
    weight: number;
    gender?: Gender;
  },
  {
    rejectValue: PostgrestError | { message: string };
    state: RootState;
  }
>(`${userSlice}/completeOnboarding`, async (payload, { getState, rejectWithValue }) => {
  const userId = getState().user.user?.id;

  if (!userId) {
    return rejectWithValue({ message: 'No user id in store. User is not signed in.' });
  }

  const result = await userService.completeOnboarding(userId, payload);

  if (result !== undefined) {
    return rejectWithValue(result.error);
  }

  return payload;
});
