import { Button } from '@drinkweise/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@drinkweise/components/ui/Card';
import { Text } from '@drinkweise/components/ui/Text';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native';

export default function DrinksPage() {
  const router = useRouter();
  return (
    <ScrollView className='p-3'>
      <TouchableOpacity onPress={() => router.replace('/drinks/session')}>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Open your Tab!</CardTitle>
            <CardDescription className='text-base'>
              Keep track of your drinks and enjoy responsibly.
            </CardDescription>
          </CardHeader>
          <CardContent className='gap-4'>
            <Button onPress={() => router.replace('/drinks/session')}>
              <Text>Begin Session</Text>
            </Button>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}
