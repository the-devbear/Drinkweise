import { LinkText, Text } from '@drinkweise/components/ui/Text';
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function SignUpPage() {
  return (
    <View className='flex gap-4'>
      <Text>Sign-Up Page</Text>
      <Link href='/(app)' asChild>
        <LinkText>Go to App</LinkText>
      </Link>
      <Link href='/sign-in' asChild>
        <LinkText>Go to Sign In</LinkText>
      </Link>
    </View>
  );
}
