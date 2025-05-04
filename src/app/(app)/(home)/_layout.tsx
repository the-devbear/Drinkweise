import { Stack } from 'expo-router';

export default function HomeTabLayout() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen
        name='index'
        options={{
          headerTitle: 'Home',
        }}
      />
      <Stack.Screen name='session/[id]' options={{ headerTitle: 'Session' }} />
    </Stack>
  );
}
