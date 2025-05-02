import { authService } from '@drinkweise/api/user';
import type { SerializedAuthError } from '@drinkweise/lib/types/redux/errors';
import { queryClient } from '@drinkweise/lib/utils/query/query-client';
import { persister } from '@drinkweise/lib/utils/query/tanstack-query.config';
import { serializeAuthError } from '@drinkweise/lib/utils/redux/serialize-errors';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { userSlice } from '../user.slice';

export const signOutAction = createAsyncThunk<void, void, { rejectValue: SerializedAuthError }>(
  `${userSlice}/signOut`,
  async (_action, { rejectWithValue }) => {
    const response = await authService.signOut();

    await persister.removeClient();
    queryClient.clear();

    if (response?.error) {
      return rejectWithValue(serializeAuthError(response.error));
    }
  }
);
