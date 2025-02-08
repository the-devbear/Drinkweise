import { Text } from '@drinkweise/components/ui/Text';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function SignInPage() {
  return (
    <View className='flex gap-4'>
      <Text>Sign-In Page</Text>
      <Link href="/(app)" asChild>
        <Text>Go to App</Text>
      </Link>
      <Link href="/sign-up" asChild push>
        <Text>Go to Sign Up</Text>
      </Link>
    </View>
  );
}
