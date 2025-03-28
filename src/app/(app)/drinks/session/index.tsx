import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function SessionPage() {
  const router = useRouter();
  return (
    <View>
      <Text>This is the session starting page</Text>
      <Button
        onPress={() => {
          router.replace('/drinks');
        }}>
        <Text>Go back to drinks</Text>
      </Button>
    </View>
  );
}
