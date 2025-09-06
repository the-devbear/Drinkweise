import { UserAvatar } from '@drinkweise/components/shared/UserAvatar';
import { useImagePicker } from '@drinkweise/lib/hooks/use-image-picker';
import { useAppDispatch } from '@drinkweise/store';
import { updateProfilePictureAction } from '@drinkweise/store/user/actions/update-profile-picture.action';
import { Text } from '@drinkweise/ui/Text';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useMutation } from '@tanstack/react-query';
import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

interface ProfilePictureSelectorProps {
  username: string;
  currentAvatarUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20',
  lg: 'h-32 w-32',
};

export function ProfilePictureSelector({
  username,
  currentAvatarUrl,
  className,
  size = 'md',
}: ProfilePictureSelectorProps) {
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();
  const { pickFromLibrary, takePhoto } = useImagePicker({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  const uploadMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const result = await dispatch(updateProfilePictureAction({ imageUri }));
      if (updateProfilePictureAction.rejected.match(result)) {
        throw new Error(result.payload?.message ?? 'Failed to update profile picture');
      }
      return result.payload;
    },
    onSuccess: () => {
      // Don't show success alert for better UX, the image update is visual feedback enough
    },
    onError: (error: Error) => {
      Alert.alert(
        'Upload Failed',
        error.message ?? 'Failed to update profile picture. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  const handleImageSelection = async (imageUri: string | null) => {
    if (!imageUri) return;

    try {
      await uploadMutation.mutateAsync(imageUri);
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error('Upload failed:', error);
    }
  };

  const isUploading = uploadMutation.isPending;

  const showImagePicker = () => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: 'Select Profile Picture',
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0: {
            const imageUri = await takePhoto();
            await handleImageSelection(imageUri);
            break;
          }
          case 1: {
            const imageUri = await pickFromLibrary();
            await handleImageSelection(imageUri);
            break;
          }
          default:
            break;
        }
      }
    );
  };

  return (
    <View className={`items-center ${className ?? ''}`}>
      <Pressable onPress={showImagePicker} disabled={isUploading} className='relative'>
        <UserAvatar
          className={`${sizeClasses[size]} ${isUploading ? 'opacity-50' : ''}`}
          username={username}
          avatarUrl={currentAvatarUrl}
        />

        {isUploading && (
          <View className='absolute inset-0 items-center justify-center'>
            <ActivityIndicator size='large' color='#007AFF' />
          </View>
        )}

        {!isUploading && (
          <View className='absolute bottom-0 right-0 rounded-full bg-primary p-2'>
            <Text className='text-xs text-white'>✎</Text>
          </View>
        )}
      </Pressable>

      {!isUploading && (
        <Pressable onPress={showImagePicker} className='mt-2'>
          <Text variant='caption1' className='text-primary'>
            {currentAvatarUrl ? 'Change Photo' : 'Add Photo'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
