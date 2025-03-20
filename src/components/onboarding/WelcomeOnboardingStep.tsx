import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { AnimatedText } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export interface WelcomeOnboardingStepProps {}

export function WelcomeOnboardingStep({}: WelcomeOnboardingStepProps) {
  const { colors } = useColorScheme();

  return (
    <View className='flex-1 p-5'>
      <Animated.View entering={FadeIn.delay(300)} className='mb-5 mt-10 items-center'>
        <Ionicons size={64} name='beer-outline' color={colors.primary} />
      </Animated.View>
      <View className='flex-1'>
        <AnimatedText
          entering={FadeInDown.delay(600)}
          variant='title1'
          className='mb-4 text-center font-bold'>
          Welcome to Drinkweise!
        </AnimatedText>
        <AnimatedText
          entering={FadeInDown.delay(900)}
          className='text-center text-lg text-gray-600 dark:text-gray-400'>
          Track your drinks, understand your habits, and maintain a healthy relationship with
          alcohol.
        </AnimatedText>
        <Animated.View entering={FadeInDown.delay(1200)} className='flex-1 p-6'>
          <TextInput
            label='What should we call you?'
            labelClassName='mb-2 text-lg font-semibold text-gray-900'
            placeholder='Enter a username'
          />
        </Animated.View>
      </View>
    </View>
  );
}
