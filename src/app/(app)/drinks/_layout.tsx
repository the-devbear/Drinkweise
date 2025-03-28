import { Stack } from 'expo-router';

export default function DrinksTabLayout() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen
        name='index'
        options={{
          headerTitle: 'Drinks',
        }}
      />
      <Stack.Screen name='session/index' options={{ headerTitle: 'Session' }} />
    </Stack>
  );
}
