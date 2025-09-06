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
      // First, optimize the image
      const optimizedImage = await this.optimizeImage(imageAsset.uri);
      
      // Convert to blob for upload
      const response = await fetch(optimizedImage.uri);
      const blob = await response.blob();
      
      // Generate unique filename
      const filename = `${userId}/profile-${Date.now()}.jpg`;
      
      // Upload to Supabase storage
      const { data, error } = await this.supabaseClient.storage
        .from(PROFILE_PICTURES_BUCKET)
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        return {
          success: false,
          error: `Upload failed: ${error.message}`,
        };
      }

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
      return await ImageManipulator.manipulateAsync(
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
        }
      );
    } catch (error) {
      // If image manipulation fails, throw an error
      throw new Error(`Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const imageUploadService = new ImageUploadService();