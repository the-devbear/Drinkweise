import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { AppState, Linking, View } from 'react-native';

export default function NotificationsSettingsPage() {
  const [notificationsPermission, setNotificationsPermission] = useState(
    Notifications.PermissionStatus.UNDETERMINED
  );

  useEffect(() => {
    async function requestPermission() {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationsPermission(status);
    }

    requestPermission();

    // We want to check the status again when the users comes back from the settings
    const { remove } = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationsPermission(status);
      }
    });
    return remove;
  }, []);

  if (notificationsPermission !== Notifications.PermissionStatus.GRANTED) {
    return (
      <View className='flex-1 p-4'>
        <Text className='text-center'>
          Please enable notifications in your device settings to manage your notification
          preferences.
        </Text>
        <Button className='mt-4' onPress={Linking.openSettings}>
          <Text>Open Settings</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-lg font-semibold'>Notifications Settings</Text>
    </View>
  );
}
