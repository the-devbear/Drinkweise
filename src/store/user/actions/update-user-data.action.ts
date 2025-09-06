import { userService } from '@drinkweise/api/user';
import { uploadUserAvatar } from '@drinkweise/lib/storage/upload-avatar';
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
>(
  `${userSlice}/updateUserData`,
  async (
    payload: UserDetailsFormData,
    {
      getState,
      rejectWithValue,
    }: {
      getState: () => RootState;
      rejectWithValue: (
        value: PostgrestError | UserProfileNotUpdated | { message: string }
      ) => any;
    }
  ) => {
  const userId = getState().user.user?.id;

  if (!userId) {
    return rejectWithValue({ message: 'No user id in store. User is not signed in.' });
  }

  const result = await userService.updateProfile(userId, payload);

  if (result !== undefined) {
    return rejectWithValue(result.error);
  }

  queryClient.invalidateQueries({
    predicate: ({ queryKey }: { queryKey: readonly unknown[] }) =>
      queryKey.findIndex((key: unknown) => key === userId) !== -1,
  });

  return payload;
}
);

export const uploadUserProfilePictureFromUriAction = createAsyncThunk<
  { profilePicture: string },
  { uri: string },
  {
    state: RootState;
    rejectValue: PostgrestError | UserProfileNotUpdated | { message: string };
  }
>(
  `${userSlice}/uploadUserProfilePictureFromUri`,
  async (
    { uri }: { uri: string },
    {
      getState,
      rejectWithValue,
    }: {
      getState: () => RootState;
      rejectWithValue: (
        value: PostgrestError | UserProfileNotUpdated | { message: string }
      ) => any;
    }
  ) => {
    const userId = getState().user.user?.id;

    if (!userId) {
      return rejectWithValue({ message: 'No user id in store. User is not signed in.' });
    }

    try {
      const { publicUrl } = await uploadUserAvatar({ userId, imageUri: uri });

      const updateResult = await userService.updateProfilePicture(userId, publicUrl);
      if (updateResult !== undefined) {
        return rejectWithValue(updateResult.error);
      }

      queryClient.invalidateQueries({
        predicate: ({ queryKey }: { queryKey: readonly unknown[] }) =>
          queryKey.findIndex((key: unknown) => key === userId) !== -1,
      });

      return { profilePicture: publicUrl };
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        return rejectWithValue({ message: (error as { message: string }).message });
      }
      return rejectWithValue({ message: 'An unexpected error happened' });
    }
  }
);
