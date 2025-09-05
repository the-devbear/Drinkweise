import { Stack } from 'expo-router';

export default function ProfileTabLayout() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name='index' options={{ headerTitle: 'Profile' }} />
      <Stack.Screen name='settings/index' options={{ headerTitle: 'Settings' }} />
      <Stack.Screen name='settings/profile' options={{ headerTitle: 'Edit Profile' }} />
      <Stack.Screen name='settings/theme' options={{ headerTitle: 'Theme' }} />
      <Stack.Screen
        name='settings/notifications'
        options={{ headerTitle: 'Notifications', gestureEnabled: false }}
      />
    </Stack>
  );
}
