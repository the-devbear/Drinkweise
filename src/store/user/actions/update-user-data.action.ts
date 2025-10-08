import { userService } from '@drinkweise/api/user';
import { UserProfileNotUpdated } from '@drinkweise/api/user/errors/user-profile-not-updated.error';
import type { UserDetailsFormData } from '@drinkweise/lib/forms/shared/user-details.schema';
import { queryClient } from '@drinkweise/lib/utils/query/query-client';
import type { RootState } from '@drinkweise/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { PostgrestError } from '@supabase/supabase-js';

import { userSlice } from '../user.slice';

export const updateUserDataAction = createAsyncThunk<
  UserDetailsFormData,
  UserDetailsFormData,
  {
    state: RootState;
    rejectValue: PostgrestError | UserProfileNotUpdated | { message: string };
  }
>(`${userSlice}/updateUserData`, async (payload, { getState, rejectWithValue }) => {
  const userId = getState().user.user?.id;

  if (!userId) {
    return rejectWithValue({ message: 'No user id in store. User is not signed in.' });
  }

  const result = await userService.updateProfile(userId, payload);

  if (result !== undefined) {
    return rejectWithValue(result.error);
  }

  await queryClient.invalidateQueries({
    predicate: ({ queryKey }) => queryKey.findIndex((key) => key === userId) !== -1,
  });

  return payload;
});
