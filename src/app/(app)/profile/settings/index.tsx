import { SettingsSection } from '@drinkweise/components/profile/settings/SettingsSection';
import { useAppDispatch } from '@drinkweise/store';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { userSlice } from '@drinkweise/store/user/user.slice';
import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useMMKV } from 'react-native-mmkv';

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const storage = useMMKV();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const clearStorageData = useCallback(() => {
    Alert.alert(
      'Reset Local Data',
      'This will clear all local data except your user account information. If you have a session running the data might be lost as well. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            queryClient.clear();
            const keys = storage.getAllKeys();

            for (const key of keys) {
              if (key === userSlice) {
                continue;
              }
              storage.delete(key);
            }

            Alert.alert('Data Reset', 'Local data has been reset successfully.', [{ text: 'OK' }]);
          },
        },
      ],
      { cancelable: true }
    );
  }, [queryClient, storage]);

  return (
    <ScrollView className='flex-1'>
      <View className='pt-6'>
        <SettingsSection
          title='Account'
          items={[
            {
              title: 'Profile',
              icon: 'person-outline',
              onPress: () => router.push('/profile/settings/profile'),
            },
          ]}
        />
        <SettingsSection
          title='Preferences'
          items={[
            {
              title: 'Notifications',
              icon: 'notifications-outline',
              onPress: () => router.push('/profile/settings/notifications'),
            },

            {
              title: 'Theme',
              icon: 'moon-outline',
              onPress: () => router.push('/profile/settings/theme'),
            },
          ]}
        />
        <SettingsSection
          title='Data & Storage'
          items={[
            {
              title: 'Reset Local Data',
              icon: 'refresh-outline',
              onPress: clearStorageData,
            },
          ]}
        />
      </View>

      <View className='px-6 pb-6'>
        <Button
          variant='destructive'
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Sign Out',
                  onPress: () => dispatch(signOutAction()),
                  style: 'destructive',
                },
              ],
              { cancelable: true }
            );
          }}>
          <Ionicons name='log-out-outline' className='mr-2 text-xl text-white' />
          <Text className='text-white'>Sign Out</Text>
        </Button>
      </View>

      <View className='items-center pb-8'>
        <Text variant='caption2' className='text-muted-foreground'>
          Drinkweise {Constants.expoConfig?.version} - {Constants.expoConfig?.slug}
        </Text>
        <Text variant='caption2' className='mt-2 text-muted-foreground'>
          Made with ❤️ for responsible drinking.
        </Text>
      </View>
    </ScrollView>
  );
}
