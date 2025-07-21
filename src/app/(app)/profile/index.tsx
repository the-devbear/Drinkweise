import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import { userSelector } from '@drinkweise/store/user';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { Button } from '@drinkweise/ui/Button';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function ProfilePage() {
  const user = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  if (!user) {
    return (
      <View className='flex-1 p-6 pt-12'>
        <Text variant='title3' className='text-center font-semibold'>
          Unable to load profile
        </Text>
        <Text className='mt-2 text-center text-sm text-muted'>
          Please try signing in again or contact support if the issue persists.
        </Text>
        <Button variant='destructive' className='mt-4' onPress={() => dispatch(signOutAction())}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    );
  }

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: user.username ?? 'Profile',
          headerTitleStyle: { fontSize: 20 },
          headerRight: () => (
            <View className='flex-row items-center gap-6'>
              <TouchableOpacity onPress={async () => {}}>
                <Ionicons name='share-outline' className='text-2xl leading-none text-foreground' />
              </TouchableOpacity>
              <TouchableOpacity onPress={async () => {}}>
                <Ionicons
                  name='settings-outline'
                  className='text-2xl leading-none text-foreground'
                />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => {}}>
              <Text className='text-sm font-medium'>Edit Profile</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Button variant='destructive' className='m-4' onPress={() => dispatch(signOutAction())}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
