import { authService } from '@drinkweise/api/user';
import { SerializedAuthError, SerializedPostgrestError } from '@drinkweise/lib/types/redux/errors';
import {
  serializeAuthError,
  serializePostgrestError,
} from '@drinkweise/lib/utils/redux/serialize-errors';
import { createAsyncThunk, miniSerializeError, SerializedError } from '@reduxjs/toolkit';
import { isAuthError } from '@supabase/supabase-js';

import { SessionModel } from '../models/session.model';
import { UserModel } from '../models/user.model';
import { userSlice } from '../user.slice';

export const signUpWithPasswordAction = createAsyncThunk<
  { user: UserModel; session: SessionModel },
  { email: string; password: string },
  {
    rejectValue: SerializedAuthError | SerializedPostgrestError | SerializedError;
  }
>(`${userSlice}/signUpWithPassword`, async ({ email, password }, { rejectWithValue }) => {
  const { value, error } = await authService.signUpWithPassword(email, password);

  if (!error) {
    return value;
  }

  if (isAuthError(error)) {
    return rejectWithValue(serializeAuthError(error));
  }

  if ('details' in error) {
    return rejectWithValue(serializePostgrestError(error));
  }

  return rejectWithValue(miniSerializeError(error));
});
