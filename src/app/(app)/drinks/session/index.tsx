import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import {
  cancelDrinkSessionAction,
  isDrinkSessionActiveSelector,
} from '@drinkweise/store/drink-session';
import { Redirect, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

export default function SessionPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isDrinkSessionActive = useAppSelector(isDrinkSessionActiveSelector);

  if (!isDrinkSessionActive) {
    return <Redirect href='/drinks' />;
  }

  return (
    <View>
      <Text>This is the session starting page</Text>
      <Button
        onPress={() => {
          router.navigate('/drinks/session/add');
        }}>
        <Text>Add new drink</Text>
      </Button>
      <Button
        onPress={() =>
          Alert.alert('Cancel session?', 'Are you sure?', [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => dispatch(cancelDrinkSessionAction()),
              style: 'destructive',
            },
          ])
        }>
        <Text>Go back to drinks</Text>
      </Button>
    </View>
  );
}
