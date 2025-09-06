import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface UseImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export interface UseImagePickerResult {
  pickFromLibrary: () => Promise<string | null>;
  takePhoto: () => Promise<string | null>;
  requestPermissions: () => Promise<boolean>;
}

export function useImagePicker(options: UseImagePickerOptions = {}): UseImagePickerResult {
  const { allowsEditing = true, aspect = [1, 1], quality = 0.8 } = options;

  const requestPermissions = async (): Promise<boolean> => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

      // Request media library permissions
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Camera access is needed to take photos. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => console.log('Open settings') },
          ]
        );
        return false;
      }

      if (libraryPermission.status !== 'granted') {
        Alert.alert(
          'Photo Library Permission Required',
          'Photo library access is needed to select images. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => console.log('Open settings') },
          ]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
      return false;
    }
  };

  const pickFromLibrary = async (): Promise<string | null> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      return result.assets[0]?.uri ?? null;
    } catch (error) {
      console.error('Error picking image from library:', error);
      Alert.alert('Error', 'Failed to select image from library');
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      return result.assets[0]?.uri ?? null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
      return null;
    }
  };

  return {
    pickFromLibrary,
    takePhoto,
    requestPermissions,
  };
}
