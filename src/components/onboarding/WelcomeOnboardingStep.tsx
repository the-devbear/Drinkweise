import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { View } from 'react-native';

export interface WelcomeOnboardingStepProps {}

export function WelcomeOnboardingStep({}: WelcomeOnboardingStepProps) {
  return (
    <View className='flex flex-1 items-center  justify-center p-5'>
      <Text variant='largeTitle'>Welcome!</Text>
      <TextInput />
    </View>
  );
}
