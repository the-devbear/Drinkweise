import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch } from '@drinkweise/store';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { View } from 'react-native';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  return (
    <View className='flex-1 p-6'>
      <Text>Tab Two</Text>
      <Button variant='destructive' onPress={() => dispatch(signOutAction())}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
