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
      // Step 1: Create FormData for React Native file upload
      console.log('Step 1: Creating FormData for React Native...');
      
      // Determine file type from URI
      let fileType = 'image/jpeg';
      let fileExtension = 'jpg';
      
      if (imageUri.toLowerCase().includes('.png')) {
        fileType = 'image/png';
        fileExtension = 'png';
      }
      
      console.log('Detected file type:', fileType);

      // Step 2: Generate filename
      console.log('Step 2: Generating filename...');
      const timestamp = Date.now();
      const fileName = `${userId}/profile-${timestamp}.${fileExtension}`;
      console.log('Generated filename:', fileName);

      // Step 3: Create file object for React Native
      console.log('Step 3: Creating file object...');
      const fileObject = {
        uri: imageUri,
        type: fileType,
        name: `profile-${timestamp}.${fileExtension}`,
      };
      
      console.log('File object:', fileObject);

      // Step 4: Upload using Supabase client with proper file handling
      console.log('Step 4: Uploading with Supabase client...');
      
      // Try using the Supabase client with the file object directly
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, fileObject as any, {
          contentType: fileType,
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from upload');
      }

      console.log('Upload successful! Data:', data);

      // Step 5: Get public URL
      console.log('Step 5: Getting public URL...');
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
