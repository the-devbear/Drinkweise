import { SettingsSection } from '@drinkweise/components/profile/settings/SettingsSection';
import { useAppDispatch } from '@drinkweise/store';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
              title: 'Theme',
              icon: 'moon-outline',
              onPress: () => router.push('/profile/settings/theme'),
            },
          ]}
        />
      </View>

      <View className='px-6 pb-6'>
        <Button variant='destructive' onPress={() => dispatch(signOutAction())}>
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
