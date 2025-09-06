import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
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
    console.log('=== PROFILE PICTURE UPLOAD START ===');
    console.log('User ID:', userId);
    console.log('Image URI:', imageUri);

    try {
      // Step 1: Fetch the image
      console.log('Step 1: Fetching image from URI...');
      const response = await fetch(imageUri);
      
      if (!response.ok) {
        const errorMsg = `Failed to fetch image: HTTP ${response.status}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Step 2: Convert to blob
      console.log('Step 2: Converting to blob...');
      const blob = await response.blob();
      console.log('Blob created - Size:', blob.size, 'bytes, Type:', blob.type);
      
      // Step 3: Basic validations
      console.log('Step 3: Validating image...');
      if (blob.size === 0) {
        throw new Error('Image file is empty');
      }
      
      if (blob.size > 10 * 1024 * 1024) {
        throw new Error('Image file is too large (>10MB)');
      }
      
      if (!blob.type || !blob.type.startsWith('image/')) {
        console.log('Invalid blob type:', blob.type);
        throw new Error('Invalid image format');
      }

      // Step 4: Generate filename
      console.log('Step 4: Generating filename...');
      const timestamp = Date.now();
      const fileExtension = blob.type.includes('png') ? 'png' : 'jpg';
      const fileName = `${userId}/profile-${timestamp}.${fileExtension}`;
      console.log('Generated filename:', fileName);

      // Step 5: Upload to Supabase
      console.log('Step 5: Uploading to Supabase storage...');
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, blob, {
          contentType: blob.type,
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from upload');
      }

      console.log('Upload successful! Path:', data.path);

      // Step 6: Get public URL
      console.log('Step 6: Getting public URL...');
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      console.log('Public URL:', urlData.publicUrl);
      console.log('=== PROFILE PICTURE UPLOAD SUCCESS ===');

      return {
        url: urlData.publicUrl,
        path: data.path,
      };

    } catch (error) {
      console.error('=== PROFILE PICTURE UPLOAD FAILED ===');
      console.error('Error:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', (error as any)?.name);
      console.error('Error message:', (error as any)?.message);
      
      // Re-throw the error with a simple message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Profile picture upload failed: ${errorMessage}`);
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
