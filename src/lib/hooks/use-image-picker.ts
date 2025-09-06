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
      console.log('useImagePicker: Requesting permissions for library...');
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('useImagePicker: Permissions denied');
        return null;
      }

      console.log('useImagePicker: Launching image library picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality,
      });

      console.log('useImagePicker: Image library result:', result);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('useImagePicker: Image selection canceled or no assets');
        return null;
      }

      const selectedUri = result.assets[0]?.uri ?? null;
      console.log('useImagePicker: Selected image URI:', selectedUri);
      return selectedUri;
    } catch (error) {
      console.error('Error picking image from library:', error);
      Alert.alert('Error', 'Failed to select image from library');
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      console.log('useImagePicker: Requesting permissions for camera...');
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('useImagePicker: Camera permissions denied');
        return null;
      }

      console.log('useImagePicker: Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality,
      });

      console.log('useImagePicker: Camera result:', result);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('useImagePicker: Camera canceled or no assets');
        return null;
      }

      const selectedUri = result.assets[0]?.uri ?? null;
      console.log('useImagePicker: Camera image URI:', selectedUri);
      return selectedUri;
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
