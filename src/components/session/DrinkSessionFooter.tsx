import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch } from '@drinkweise/store';
import { cancelDrinkSessionAction } from '@drinkweise/store/drink-session';
import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

export function DrinkSessionFooter() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <View className='flex-row items-center justify-center gap-5 px-1 pt-6'>
      <Button
        className='bg-card'
        onPress={() => {
          Alert.alert('Cancel Session', 'Are you sure you want to cancel the session?', [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => dispatch(cancelDrinkSessionAction()),
              style: 'destructive',
            },
          ]);
        }}>
        <Text className='text-destructive'>Cancel Session</Text>
      </Button>
      <Button className='flex-1' onPress={() => router.navigate('/drinks/session/add')}>
        <Text>Add new drink</Text>
      </Button>
    </View>
  );
}
