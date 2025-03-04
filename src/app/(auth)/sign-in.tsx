import { LinkText, Text } from '@drinkweise/components/ui/Text';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function SignInPage() {
  return (
    <View className='flex gap-4'>
      <Text>Sign-In Page</Text>
      <Link href='/(app)' asChild>
        <LinkText>Go to App</LinkText>
      </Link>
      <Link href='/sign-up' asChild push>
        <LinkText>Go to Sign Up</LinkText>
      </Link>
    </View>
  );
}
