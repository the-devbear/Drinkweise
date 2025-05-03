import { Text } from '@drinkweise/ui/Text';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function SessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <>
      <Stack.Screen options={{ title: `Session ID: ${id}` }} />
      <View className='flex-1 items-center justify-center'>
        <Text>Session ID: {id}</Text>
        <Text variant='subhead' className='mt-4'>
          This is the detail view for the session.
        </Text>
      </View>
    </>
  );
}
