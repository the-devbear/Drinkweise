import { authService } from '@drinkweise/api/user';
import type {
  SerializedAuthError,
  SerializedCodedError,
  SerializedPostgrestError,
} from '@drinkweise/lib/types/redux/errors';
import { isCodedError } from '@drinkweise/lib/utils/error/is-coded-error';
import {
  serializeAuthError,
  serializeCodedError,
  serializePostgrestError,
} from '@drinkweise/lib/utils/redux/serialize-errors';
import { createAsyncThunk, miniSerializeError, type SerializedError } from '@reduxjs/toolkit';
import { isAuthError } from '@supabase/supabase-js';

import type { SessionModel } from '../models/session.model';
import type { UserModel } from '../models/user.model';
import { userSlice } from '../user.slice';

export const signInWithAppleAction = createAsyncThunk<
  { user: UserModel; session: SessionModel },
  void,
  {
    rejectValue:
      | SerializedAuthError
      | SerializedPostgrestError
      | SerializedCodedError
      | SerializedError;
  }
>(`${userSlice}/signInWithApple`, async (_, { rejectWithValue }) => {
  const { value, error } = await authService.signInWithApple();

  if (!error) {
    return value;
  }

  if (isAuthError(error)) {
    return rejectWithValue(serializeAuthError(error));
  }

  if ('details' in error) {
    return rejectWithValue(serializePostgrestError(error));
  }

  if (isCodedError(error)) {
    return rejectWithValue(serializeCodedError(error));
  }

  return rejectWithValue(miniSerializeError(error));
});
