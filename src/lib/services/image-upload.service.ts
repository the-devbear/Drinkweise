import { supabase } from '@drinkweise/lib/supabase';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import * as ImageManipulator from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';

interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const PROFILE_PICTURES_BUCKET = 'profile-pictures';
const MAX_IMAGE_SIZE = 512; // Max width/height in pixels
const IMAGE_QUALITY = 0.8; // Compression quality (0-1)

export class ImageUploadService {
  constructor(private readonly supabaseClient: TypedSupabaseClient = supabase) {}

  /**
   * Uploads a profile picture to Supabase storage with compression and optimization
   */
  async uploadProfilePicture(userId: string, imageAsset: ImagePickerAsset): Promise<ImageUploadResult> {
    try {
      console.log('Starting profile picture upload for user:', userId);
      console.log('Original image asset:', { uri: imageAsset.uri, width: imageAsset.width, height: imageAsset.height });
      
      // First, optimize the image
      const optimizedImage = await this.optimizeImage(imageAsset.uri);
      console.log('Optimized image result:', { uri: optimizedImage.uri, width: optimizedImage.width, height: optimizedImage.height });
      
      // Convert to proper format for upload in React Native
      const response = await fetch(optimizedImage.uri);
      const blob = await response.blob();
      
      console.log('Blob created:', { size: blob.size, type: blob.type });
      
      // Ensure blob has proper size - check if optimization worked
      if (blob.size === 0) {
        throw new Error('Image processing resulted in empty file');
      }
      
      // Generate unique filename
      const filename = `${userId}/profile-${Date.now()}.jpg`;
      
      // Upload to Supabase storage
      console.log('Uploading to Supabase with filename:', filename);
      const { data, error } = await this.supabaseClient.storage
        .from(PROFILE_PICTURES_BUCKET)
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return {
          success: false,
          error: `Upload failed: ${error.message}`,
        };
      }

      console.log('Upload successful:', data);

      // Get the public URL
      const { data: urlData } = this.supabaseClient.storage
        .from(PROFILE_PICTURES_BUCKET)
        .getPublicUrl(data.path);

      return {
        success: true,
        url: urlData.publicUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Deletes a profile picture from Supabase storage
   */
  async deleteProfilePicture(profilePictureUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const url = new URL(profilePictureUrl);
      const pathParts = url.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];
      const userId = pathParts[pathParts.length - 2];
      const filePath = `${userId}/${filename}`;

      const { error } = await this.supabaseClient.storage
        .from(PROFILE_PICTURES_BUCKET)
        .remove([filePath]);

      return !error;
    } catch (error) {
      console.warn('Failed to delete old profile picture:', error);
      return false;
    }
  }

  /**
   * Optimizes an image by resizing and compressing it
   */
  private async optimizeImage(imageUri: string): Promise<ImageManipulator.ImageResult> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: MAX_IMAGE_SIZE,
              height: MAX_IMAGE_SIZE,
            },
          },
        ],
        {
          compress: IMAGE_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false, // Ensure we don't get base64, we want URI
        }
      );
      
      // Verify the result has a valid URI
      if (!result.uri) {
        throw new Error('Image manipulation returned empty URI');
      }
      
      return result;
    } catch (error) {
      // If image manipulation fails, throw an error
      throw new Error(`Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const imageUploadService = new ImageUploadService();