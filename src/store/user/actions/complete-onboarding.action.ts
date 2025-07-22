import { userService } from '@drinkweise/api/user';
import type { UserDetailsFormData } from '@drinkweise/lib/forms/shared/user-details.schema';
import type { RootState } from '@drinkweise/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { PostgrestError } from '@supabase/supabase-js';

import { userSlice } from '../user.slice';

export const completeOnboardingAction = createAsyncThunk<
  UserDetailsFormData,
  UserDetailsFormData,
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
