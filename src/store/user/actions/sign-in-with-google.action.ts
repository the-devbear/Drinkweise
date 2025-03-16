import { authService } from '@drinkweise/api/user';
import type {
  SerializedAuthError,
  SerializedPostgrestError,
} from '@drinkweise/lib/types/redux/errors';
import {
  serializeAuthError,
  serializePostgrestError,
} from '@drinkweise/lib/utils/redux/serialize-errors';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAuthError } from '@supabase/supabase-js';

import type { SessionModel } from '../models/session.model';
import type { UserModel } from '../models/user.model';
import { userSlice } from '../user.slice';

export const signInWithGoogleAction = createAsyncThunk<
  { user: UserModel; session: SessionModel },
  void,
  {
    rejectValue:
      | SerializedAuthError
      | SerializedPostgrestError
      | { message: string; cancelled: boolean };
  }
>(`${userSlice}/signInWithGoogle`, async (_, { rejectWithValue }) => {
  const { value, error } = await authService.signInWithGoogle();

  if (!error) {
    return value;
  }

  if (isAuthError(error)) {
    return rejectWithValue(serializeAuthError(error));
  }

  if ('details' in error) {
    return rejectWithValue(serializePostgrestError(error));
  }

  if ('type' in error) {
    return rejectWithValue({ message: error.message, cancelled: true });
  }

  return rejectWithValue({ message: error.message, cancelled: false });
});
