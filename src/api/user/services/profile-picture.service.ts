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
      // Compress the image
      let compressedUri: string;
      try {
        compressedUri = await compressImage(imageUri, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.8,
        });
      } catch (error) {
        throw ProfilePictureUploadError.fromCompressionFailure(error as Error);
      }

      // Convert image to base64
      let response: Response;
      let blob: Blob;
      let arrayBuffer: ArrayBuffer;

      try {
        response = await fetch(compressedUri);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        blob = await response.blob();

        // Check file size (5MB limit)
        if (blob.size > 5 * 1024 * 1024) {
          throw ProfilePictureUploadError.fromFileTooLarge();
        }

        // Check file type
        if (!blob.type.startsWith('image/')) {
          throw ProfilePictureUploadError.fromInvalidFormat();
        }

        arrayBuffer = await blob.arrayBuffer();
      } catch (error) {
        if (error instanceof ProfilePictureUploadError) {
          throw error;
        }
        throw ProfilePictureUploadError.fromCompressionFailure(error as Error);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${userId}/profile-${timestamp}.jpg`;

      // Upload to Supabase Storage using arrayBuffer directly
      try {
        const { data, error } = await this.supabase.storage
          .from(this.bucketName)
          .upload(fileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (error) {
          throw ProfilePictureUploadError.fromStorageFailure(new Error(error.message));
        }

        // Get public URL
        const { data: urlData } = this.supabase.storage
          .from(this.bucketName)
          .getPublicUrl(data.path);

        return {
          url: urlData.publicUrl,
          path: data.path,
        };
      } catch (error) {
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

      throw new ProfilePictureUploadError('An unexpected error occurred while uploading the image');
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
