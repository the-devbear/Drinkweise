import { useAppSelector } from '@drinkweise/store';
import { userNotificationPreferencesSelector } from '@drinkweise/store/user';
import type { NotificationPreferencesModel } from '@drinkweise/store/user/models/notification-preferences.model';
import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useState } from 'react';
import { AppState, Linking, ScrollView, View } from 'react-native';

type NotificationPreferencesConfiguration = {
  [Group in keyof NotificationPreferencesModel]: {
    title: string;
    groupKey: Group;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    settings: {
      [Key in keyof NotificationPreferencesModel[Group]]: {
        title: string;
        description: string;
        key: Key;
        enabled: boolean;
      };
    };
  };
};

export default function NotificationsSettingsPage() {
  const [notificationsPermission, setNotificationsPermission] = useState(
    Notifications.PermissionStatus.UNDETERMINED
  );

  const notificationPreferences = useAppSelector(userNotificationPreferencesSelector);
  const notificationPreferencesConfig: NotificationPreferencesConfiguration = useMemo(
    () => ({
      drinkSession: {
        title: 'Drink Session',
        description: 'Updates about your drink session',
        groupKey: 'drinkSession',
        icon: 'beer-outline',
        settings: {
          reminders: {
            title: 'Session Reminders',
            description: 'Receive reminders for your drink session',
            key: 'reminders',
            enabled: notificationPreferences.drinkSession.reminders,
          },
        },
      },
    }),
    [notificationPreferences]
  );

  const notificationGroups = useMemo(
    () =>
      Object.values(notificationPreferencesConfig).map((group) => {
        return {
          title: group.title,
          description: group.description,
          icon: group.icon,
          group: group.groupKey,
          settings: Object.values(group.settings).map((setting) => ({
            key: setting.key,
            title: setting.title,
            description: setting.description,
            enabled: setting.enabled,
          })),
        };
      }),
    [notificationPreferencesConfig]
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
    <ScrollView className='flex-1'>
      <Text className='text-lg font-semibold'>Notifications Settings</Text>
      <Text>{JSON.stringify(notificationGroups, null, 2)}</Text>
    </ScrollView>
  );
}
