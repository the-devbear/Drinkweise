import { Button } from '@drinkweise/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@drinkweise/components/ui/Card';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import {
  isDrinkSessionActiveSelector,
  startDrinkSessionAction,
} from '@drinkweise/store/drink-session';
import { Redirect } from 'expo-router';
import { ScrollView, TouchableOpacity } from 'react-native';

export default function DrinksPage() {
  const dispatch = useAppDispatch();

  const isDrinkSessionActive = useAppSelector(isDrinkSessionActiveSelector);

  if (isDrinkSessionActive) {
    return <Redirect href='/drinks/session' />;
  }

  return (
    <ScrollView className='p-3'>
      <TouchableOpacity onPress={() => dispatch(startDrinkSessionAction())} activeOpacity={0.5}>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Open your Tab!</CardTitle>
            <CardDescription className='text-base'>
              Keep track of your drinks and enjoy responsibly.
            </CardDescription>
          </CardHeader>
          <CardContent className='gap-4'>
            <Button onPress={() => dispatch(startDrinkSessionAction())}>
              <Text>Begin Session</Text>
            </Button>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}
