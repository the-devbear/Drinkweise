import { useExportUserData } from '@drinkweise/lib/export/hooks/use-export-user-data';
import { ActivityIndicator } from '@drinkweise/ui/ActivityIndicator';
import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';

interface ExportDataSettingsSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function ExportDataSettingsSection({ title, icon }: ExportDataSettingsSectionProps) {
  const { exportData, cancelExport, isExporting, error } = useExportUserData();
  const [isVisible, setIsVisible] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportData = async () => {
    await exportData();

    if (!error) {
      setExportStatus('success');
    } else {
      setExportStatus('error');
    }
  };

  const handleCancel = () => {
    if (isExporting) {
      cancelExport();
    }
    setIsVisible(false);
    setExportStatus('idle');
  };

  const handleClose = () => {
    setIsVisible(false);
    setExportStatus('idle');
  };

  return (
    <>
      <Modal visible={isVisible} transparent animationType='fade'>
        <View className='flex-1 items-center justify-center bg-black/50'>
          <View className='w-4/5 rounded-lg bg-white p-6'>
            <TouchableOpacity className='absolute right-2 top-2' onPress={handleCancel}>
              <Ionicons name='close' className='text-3xl text-foreground' />
            </TouchableOpacity>
            {isExporting ? (
              <View className='items-center'>
                <ActivityIndicator size='large' className='mb-4' />
                <Text>Exporting data, please wait...</Text>
                <Button className='mt-4' variant='destructive' onPress={handleCancel}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            ) : exportStatus === 'success' ? (
              <View className='items-center'>
                <View className='mb-4 h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                  <Ionicons name='checkmark-circle' className='text-5xl text-green-500' />
                </View>
                <Text className='mb-2 text-center font-semibold'>Export Successful</Text>
                <Text variant='body' className='mb-6 text-center'>
                  Your data has been exported successfully.
                </Text>
                <Button onPress={handleClose}>
                  <Text>OK</Text>
                </Button>
              </View>
            ) : exportStatus === 'error' ? (
              <View className='items-center'>
                <View className='mb-4 h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                  <Ionicons name='close-circle' className='text-5xl text-red-500' />
                </View>
                <Text className='mb-2 text-center font-semibold'>Export Failed</Text>
                <Text variant='body' className='mb-6 text-center'>
                  {error ?? 'An error occurred while exporting your data.'}
                </Text>
                <Button onPress={handleClose}>
                  <Text>OK</Text>
                </Button>
              </View>
            ) : (
              <>
                <Text className='mb-4'>Export Data</Text>
                <Text variant='body' className='mb-6'>
                  Are you sure you want to export your data? This will generate a JSON file
                  containing all your drink sessions and profile information.
                </Text>
                <View className='flex-row justify-end gap-2'>
                  <Button variant='secondary' onPress={handleCancel}>
                    <Text>Cancel</Text>
                  </Button>
                  <Button onPress={handleExportData}>
                    <Text>Confirm</Text>
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        className='flex-row items-center px-4 py-3'
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}>
        <View className='mr-3'>
          <Ionicons name={icon} size={22} className='text-foreground' />
        </View>
        <View className='flex-1'>
          <Text variant='body' className='font-medium'>
            {title}
          </Text>
        </View>
        <Ionicons name='chevron-forward-outline' size={16} className='text-muted' />
      </TouchableOpacity>
    </>
  );
}
