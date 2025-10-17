import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { type BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { cssInterop } from 'nativewind';
import { useEffect, useState } from 'react';
import { Linking, Modal, TouchableOpacity, View } from 'react-native';

cssInterop(CameraView, {
  className: 'style',
});

interface BarcodeScannerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

export function BarcodeScannerModal({
  isVisible,
  onClose,
  onBarcodeScanned,
}: BarcodeScannerModalProps) {
  const [status, requestPermission] = useCameraPermissions();
  const [isTorchEnabled, setIsTorchEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (isVisible) {
      setIsScanning(true);
    }
  }, [isVisible]);

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (!isScanning) return;

    setIsScanning(false);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    onBarcodeScanned(result.data);
    onClose();
  };

  if (status?.granted !== true) {
    return (
      <Modal
        visible={isVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={onClose}>
        <View className='flex-1 items-center justify-center'>
          <Text className='mb-4'>Camera access is required to scan barcodes.</Text>
          <Button
            onPress={async () => {
              if (status?.canAskAgain === true) {
                await requestPermission();
                return;
              }
              await Linking.openSettings();
            }}>
            <Text>{status?.canAskAgain === true ? 'Grant permission' : 'Open settings'}</Text>
          </Button>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={isVisible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}>
      <CameraView
        className='flex-1 items-center justify-center'
        enableTorch={isTorchEnabled}
        autofocus='on'
        onBarcodeScanned={handleBarcodeScanned}>
        <View className='absolute left-0 right-0 top-0 flex-row items-center justify-between bg-black/75 px-4 pb-3 pt-4'>
          <TouchableOpacity
            onPress={() => setIsTorchEnabled((value) => !value)}
            className='h-10 w-10 items-center justify-center'>
            <Ionicons name={isTorchEnabled ? 'flash' : 'flash-outline'} size={24} color='white' />
          </TouchableOpacity>
          <Text className='text-white'>Scan a barcode</Text>

          <TouchableOpacity onPress={onClose} className='h-10 w-10 items-center justify-center'>
            <Ionicons name='close' size={24} color='white' />
          </TouchableOpacity>
        </View>
        <View className='h-2/6 w-3/4 rounded-lg border-2 border-white' />

        <Text className='mt-4 rounded-lg bg-black/50 px-4 py-2 text-center text-base text-white'>
          Hold a barcode within the frame to scan it.
        </Text>
      </CameraView>
    </Modal>
  );
}
