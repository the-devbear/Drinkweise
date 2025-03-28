import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useRouter } from 'expo-router';

export default function DrinksPage() {
  const router = useRouter();
  return (
    <Button
      onPress={() => {
        router.replace('/drinks/session');
      }}>
      <Text>Start session</Text>
    </Button>
  );
}
