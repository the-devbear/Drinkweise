import { supabase } from '@drinkweise/lib/supabase';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ProfilePictureUploadError } from '../../../api/user/errors/profile-picture-upload.error';
import { ProfilePictureService } from '../../../api/user/services/profile-picture.service';
import { UserService } from '../../../api/user/services/user.service';

export interface UpdateProfilePicturePayload {
  imageUri: string;
}

export const updateProfilePictureAction = createAsyncThunk<
  { profilePicture: string },
  UpdateProfilePicturePayload,
  { rejectValue: { message: string } }
>(
  'user/updateProfilePicture',
  async ({ imageUri }: UpdateProfilePicturePayload, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { user: { user?: { id: string } } };
      const userId = state.user.user?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const profilePictureService = new ProfilePictureService(supabase);
      const userService = new UserService(supabase);

      // Upload the image
      const uploadResult = await profilePictureService.uploadProfilePicture(userId, imageUri);

      // Update user profile with new image URL
      const updateResult = await userService.updateProfilePicture(userId, uploadResult.url);

      if (updateResult?.error) {
        // If database update fails, clean up the uploaded image
        try {
          await profilePictureService.deleteProfilePicture(userId, uploadResult.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
        }
        throw ProfilePictureUploadError.fromDatabaseFailure(new Error('Failed to update profile'));
      }

      return {
        profilePicture: uploadResult.url,
      };
    } catch (error) {
      console.error('Profile picture update failed:', error);

      if (error instanceof ProfilePictureUploadError) {
        return rejectWithValue({ message: error.message });
      }

      const message = error instanceof Error ? error.message : 'Failed to update profile picture';
      return rejectWithValue({ message });
    }
  }
);
