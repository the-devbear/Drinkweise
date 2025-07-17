import { Stack } from 'expo-router';

export default function AddDrinkLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerTitle: 'Add drink',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name='create'
        options={{
          headerTitle: 'Create drink',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </Stack>
  );
}
