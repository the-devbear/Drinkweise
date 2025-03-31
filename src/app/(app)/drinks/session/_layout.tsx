import { Stack } from 'expo-router';

export default function SessionLayout() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen name='index' options={{ headerTitle: 'Session' }} />
      <Stack.Screen
        name='add'
        options={{
          headerTitle: 'Add new Drink',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
