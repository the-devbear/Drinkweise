import { Text } from '@drinkweise/components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { BarcodeScanningResult, CameraView } from 'expo-camera';
import { cssInterop } from 'nativewind';
import { useCallback, useState, useEffect } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';

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
  const [isTorchEnabled, setIsTorchEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  // Reset scanning state when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setIsScanning(true);
    }
  }, [isVisible]);

  const handleBarcodeScanned = useCallback<(result: BarcodeScanningResult) => void>(
    (result) => {
      if (!isScanning) return;

      setIsScanning(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onBarcodeScanned(result.data);
      onClose();
    },
    [isScanning, onBarcodeScanned, onClose]
  );

  return (
    <Modal
      visible={isVisible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}>
      <CameraView
        className='flex-1 items-center justify-center'
        enableTorch={isTorchEnabled}
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
