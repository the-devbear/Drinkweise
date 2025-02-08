import { Text } from '@drinkweise/components/ui/Text';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function SignUpPage() {
  return (
    <View className='flex gap-4'>
      <Text>Sign-Up Page</Text>
      <Link href='/(app)' asChild>
        <Text>Go to App</Text>
      </Link>
      <Link href='/sign-in' asChild>
        <Text>Go to Sign In</Text>
      </Link>
    </View>
  );
}
