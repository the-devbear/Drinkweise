import { cn } from '@drinkweise/lib/cn';
import { imageUploadService } from '@drinkweise/lib/services/image-upload.service';
import { Avatar, AvatarFallback, AvatarImage } from '@drinkweise/ui/Avatar';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { cssInterop } from 'nativewind';
import React, { useState } from 'react';
import { Alert, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';

cssInterop(Ionicons, {
  className: 'style',
});

interface ProfilePictureUploadProps {
  userId: string;
  currentImageUrl?: string;
  username: string;
  onUploadComplete: (imageUrl: string) => void;
  onUploadError: (error: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function ProfilePictureUploadContent({
  userId,
  currentImageUrl,
  username,
  onUploadComplete,
  onUploadError,
  className,
  size = 'md',
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-32 w-32',
  };

  const userInitials = username
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleUploadPress = () => {
    const options = ['Take Photo', 'Choose from Gallery', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: 'Select Profile Picture',
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            await handleCameraCapture();
            break;
          case 1:
            await handleGalleryPick();
            break;
          default:
            break;
        }
      }
    );
  };

  const handleCameraCapture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permissions in your device settings to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        mediaTypes: 'images',
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      onUploadError(`Camera error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGalleryPick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Gallery Permission Required',
          'Please enable gallery permissions in your device settings to select photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        mediaTypes: 'images',
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0]);
      }
    } catch (error) {
      onUploadError(`Gallery error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const uploadImage = async (imageAsset: ImagePicker.ImagePickerAsset) => {
    setIsUploading(true);
    try {
      // Delete old profile picture if exists
      if (currentImageUrl) {
        await imageUploadService.deleteProfilePicture(currentImageUrl);
      }

      // Upload new image
      const result = await imageUploadService.uploadProfilePicture(userId, imageAsset);

      if (result.success && result.url) {
        onUploadComplete(result.url);
      } else {
        onUploadError(result.error || 'Failed to upload image');
      }
    } catch (error) {
      onUploadError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleUploadPress}
      disabled={isUploading}
      className={cn('relative', className)}>
      <Avatar className={cn(sizeClasses[size], 'border-2 border-border')} alt={username}>
        <AvatarImage source={{ uri: currentImageUrl }} />
        <AvatarFallback className="bg-primary">
          <Text className="text-primary-foreground font-semibold">{userInitials}</Text>
        </AvatarFallback>
      </Avatar>

      {/* Upload indicator/button overlay */}
      <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-primary shadow-sm">
        {isUploading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons name="camera" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
}

export function ProfilePictureUpload(props: ProfilePictureUploadProps) {
  return (
    <ActionSheetProvider>
      <ProfilePictureUploadContent {...props} />
    </ActionSheetProvider>
  );
}