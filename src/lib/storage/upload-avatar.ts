import { supabase } from '@drinkweise/lib/supabase';
import * as ImageManipulator from 'expo-image-manipulator';

interface UploadAvatarOptions {
  userId: string;
  imageUri: string;
}

interface UploadAvatarResult {
  publicUrl: string;
}

export async function uploadUserAvatar({ userId, imageUri }: UploadAvatarOptions): Promise<UploadAvatarResult> {
  const manipulated = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 512, height: 512 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  const response = await fetch(manipulated.uri);
  const blob = await response.blob();

  const filePath = `avatars/${userId}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('public')
    .upload(filePath, blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '3600' });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage.from('public').getPublicUrl(filePath);

  return { publicUrl: publicUrlData.publicUrl };
}

