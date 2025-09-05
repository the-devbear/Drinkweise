import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import {
  updateNotificationPreferencesAction,
  userNotificationPreferencesSelector,
} from '@drinkweise/store/user';
import type { NotificationPreferencesModel } from '@drinkweise/store/user/models/notification-preferences.model';
import { Button } from '@drinkweise/ui/Button';
import { Divider } from '@drinkweise/ui/Divider';
import { Text } from '@drinkweise/ui/Text';
import { Toggle } from '@drinkweise/ui/Toggle';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, Linking, ScrollView, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { usePreventRemove } from '@react-navigation/native';

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
  const dispatch = useAppDispatch();
  const [notificationsPermission, setNotificationsPermission] = useState(
    Notifications.PermissionStatus.UNDETERMINED
  );

  const notificationPreferences = useAppSelector(userNotificationPreferencesSelector);
  const [initialNotificationPreferences] = useState(notificationPreferences);
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
          groupKey: group.groupKey,
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

  const getGroupEnabledState = useCallback(
    (group: (typeof notificationGroups)[number]): 'none' | 'some' | 'all' => {
      const enabledCount = group.settings.filter((setting) => setting.enabled).length;
      const totalCount = group.settings.length;

      if (enabledCount === 0) return 'none';
      if (enabledCount === totalCount) return 'all';
      return 'some';
    },
    []
  );

  const updateNotificationPreferences = useCallback(
    ({
      group,
      key,
      value,
    }: {
      [G in keyof NotificationPreferencesModel]: {
        group: G;
        key?: keyof NotificationPreferencesModel[G];
        value: boolean;
      };
    }[keyof NotificationPreferencesModel]) => {
      const updatedGroup =
        key === undefined
          ? // If no key is provided, update all settings in the group
            (Object.fromEntries(
              Object.keys(notificationPreferences[group]).map((k) => [k, value])
            ) as NotificationPreferencesModel[typeof group])
          : // Some typescript wizardry to ensure type safety. I think when we have multiple keys we can remove this :)
            {
              ...notificationPreferences[group],
              [key]: value,
            };

      dispatch(
        updateNotificationPreferencesAction({
          ...notificationPreferences,
          [group]: updatedGroup,
        })
      );
    },
    [dispatch, notificationPreferences]
  );

  usePreventRemove(
    JSON.stringify(notificationPreferences) !== JSON.stringify(initialNotificationPreferences),
    () => {
      console.log('Notification preferences changed');
    }
  );

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
      <View className='px-6 py-4'>
        <View className='mb-6'>
          <Text variant='title2' className='mb-2 font-semibold'>
            Notification Settings
          </Text>
          <Text variant='footnote' color='tertiary'>
            Choose which notifications you'd like to receive to stay informed about your drinking
            habits and app updates. All notifications are enabled by default.
          </Text>
        </View>
        {notificationGroups.map((group) => {
          const groupState = getGroupEnabledState(group);

          return (
            <View key={group.groupKey} className='mb-6'>
              <View className='rounded-xl bg-card'>
                <View className='border-border/50 border-b px-4 py-4'>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-1 flex-row items-center'>
                      <View className='bg-primary/10 dark:bg-primary/25 mr-3 h-12 w-12 items-center justify-center rounded-xl'>
                        <Ionicons name={group.icon} className='text-[30px] text-primary' />
                      </View>
                      <View className='flex-1'>
                        <View className='flex-row items-center'>
                          <Text variant='heading' className='mr-2'>
                            {group.title}
                          </Text>
                          {groupState === 'some' && (
                            <Animated.View
                              className='bg-primary/20 rounded-full px-2 py-0.5'
                              entering={FadeIn}
                              exiting={FadeOut}>
                              <Text variant='caption1' className='font-medium text-primary'>
                                Partial
                              </Text>
                            </Animated.View>
                          )}
                        </View>
                        <Text variant='caption1' className='mt-0.5'>
                          {group.description}
                        </Text>
                      </View>
                    </View>
                    <View className='ml-3'>
                      <Toggle
                        value={groupState === 'all'}
                        onValueChange={(value) => {
                          updateNotificationPreferences({
                            group: group.groupKey,
                            value,
                          });
                        }}
                      />
                    </View>
                  </View>
                </View>

                <View className='px-4'>
                  {group.settings.map((setting, settingIndex) => (
                    <View key={setting.title}>
                      <View className='flex-row items-center justify-between py-3'>
                        <View className='mr-4 flex-1'>
                          <Text variant='body' className='font-medium'>
                            {setting.title}
                          </Text>
                          <Text variant='caption1' className='mt-0.5'>
                            {setting.description}
                          </Text>
                        </View>
                        <Toggle
                          value={setting.enabled}
                          onValueChange={(value) => {
                            updateNotificationPreferences({
                              group: group.groupKey,
                              key: setting.key as keyof NotificationPreferencesModel[typeof group.groupKey],
                              value,
                            });
                          }}
                        />
                      </View>
                      {settingIndex < group.settings.length - 1 && (
                        <Divider className='my-0' thickness='thin' />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
        <View>
          <Text variant='footnote' color='tertiary' className='mb-4 text-center'>
            If you would like to disable notifications compleltely, you can do so in your device
            settings.
          </Text>
          <Button variant='tonal' size='sm' onPress={Linking.openSettings}>
            <Text>Open Device Settings</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
