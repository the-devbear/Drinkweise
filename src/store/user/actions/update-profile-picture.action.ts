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
      console.log('=== Starting profile picture update action ===');
      console.log('Image URI received:', imageUri);
      
      const state = getState() as { user: { user?: { id: string } } };
      const userId = state.user.user?.id;

      if (!userId) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('User ID:', userId);

      const profilePictureService = new ProfilePictureService(supabase);
      const userService = new UserService(supabase);

      console.log('Starting image upload...');
      // Upload the image
      const uploadResult = await profilePictureService.uploadProfilePicture(userId, imageUri);
      console.log('Image upload completed:', uploadResult);

      console.log('Updating user profile in database...');
      // Update user profile with new image URL
      const updateResult = await userService.updateProfilePicture(userId, uploadResult.url);

      if (updateResult?.error) {
        console.error('Database update failed:', updateResult.error);
        // If database update fails, clean up the uploaded image
        try {
          console.log('Cleaning up uploaded image...');
          await profilePictureService.deleteProfilePicture(userId, uploadResult.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
        }
        throw ProfilePictureUploadError.fromDatabaseFailure(new Error('Failed to update profile'));
      }

      console.log('Profile picture update completed successfully');
      return {
        profilePicture: uploadResult.url,
      };
    } catch (error) {
      console.error('=== Profile picture update failed ===');
      console.error('Error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      
      if (error instanceof ProfilePictureUploadError) {
        console.error('ProfilePictureUploadError message:', error.message);
        return rejectWithValue({ message: error.message });
      }
      
      const message = error instanceof Error ? error.message : 'Failed to update profile picture';
      console.error('Final error message:', message);
      return rejectWithValue({ message });
    }
  }
);
