import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import { compressImage } from '@drinkweise/lib/utils/image/image-compression';
import type { FileObject } from '@supabase/storage-js';

import { ProfilePictureUploadError } from '../errors/profile-picture-upload.error';

export interface UploadProfilePictureResult {
  url: string;
  path: string;
}

export class ProfilePictureService {
  private readonly bucketName = 'profile-pictures';

  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async uploadProfilePicture(
    userId: string,
    imageUri: string
  ): Promise<UploadProfilePictureResult> {
    try {
      console.log('Starting profile picture upload for user:', userId);
      console.log('Image URI:', imageUri);

      // Convert image to blob directly without compression
      let response: Response;
      let blob: Blob;
      
      try {
        console.log('Fetching image from URI...');
        response = await fetch(imageUri);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        blob = await response.blob();
        console.log('Image blob created, size:', blob.size, 'type:', blob.type);
        
        // Check file size (10MB limit - increased for debugging)
        if (blob.size > 10 * 1024 * 1024) {
          throw ProfilePictureUploadError.fromFileTooLarge();
        }
        
        // Check file type
        if (!blob.type.startsWith('image/')) {
          throw ProfilePictureUploadError.fromInvalidFormat();
        }
        
      } catch (error) {
        console.error('Error processing image:', error);
        if (error instanceof ProfilePictureUploadError) {
          throw error;
        }
        throw new ProfilePictureUploadError('Failed to process image: ' + (error as Error).message);
      }

      // Generate unique filename with original extension
      const timestamp = Date.now();
      const fileExtension = blob.type === 'image/png' ? 'png' : 'jpg';
      const fileName = `${userId}/profile-${timestamp}.${fileExtension}`;
      console.log('Generated filename:', fileName);

      // Upload to Supabase Storage using blob directly
      try {
        console.log('Uploading to Supabase storage...');
        const { data, error } = await this.supabase.storage
          .from(this.bucketName)
          .upload(fileName, blob, {
            contentType: blob.type,
            upsert: true,
          });

        if (error) {
          console.error('Supabase storage error:', error);
          throw ProfilePictureUploadError.fromStorageFailure(new Error(error.message));
        }

        console.log('Upload successful, data:', data);

        // Get public URL
        const { data: urlData } = this.supabase.storage
          .from(this.bucketName)
          .getPublicUrl(data.path);

        console.log('Public URL generated:', urlData.publicUrl);

        return {
          url: urlData.publicUrl,
          path: data.path,
        };
      } catch (error) {
        console.error('Error during upload:', error);
        if (error instanceof ProfilePictureUploadError) {
          throw error;
        }
        throw ProfilePictureUploadError.fromStorageFailure(error as Error);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      
      if (error instanceof ProfilePictureUploadError) {
        throw error;
      }
      
      throw new ProfilePictureUploadError('An unexpected error occurred while uploading the image: ' + (error as Error).message);
    }
  }

  public async deleteProfilePicture(userId: string, filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage.from(this.bucketName).remove([filePath]);

      if (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      throw error instanceof Error ? error : new Error('Failed to delete profile picture');
    }
  }

  public async listProfilePictures(userId: string): Promise<FileObject[]> {
    try {
      const { data, error } = await this.supabase.storage.from(this.bucketName).list(userId, {
        limit: 100,
        offset: 0,
      });

      if (error) {
        throw new Error(`Failed to list images: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error listing profile pictures:', error);
      throw error instanceof Error ? error : new Error('Failed to list profile pictures');
    }
  }
}
