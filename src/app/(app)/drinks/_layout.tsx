import { Stack } from 'expo-router';

export default function DrinksTabLayout() {
  return (
    <Stack initialRouteName='session'>
      <Stack.Screen
        name='index'
        options={{
          headerTitle: 'Drinks',
        }}
      />
      <Stack.Screen
        name='session'
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
