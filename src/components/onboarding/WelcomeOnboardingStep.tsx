import type { OnboardingFormControl } from '@drinkweise/lib/forms/onboarding';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { AnimatedText } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
} from 'react-native-reanimated';

export interface WelcomeOnboardingStepProps {
  control: OnboardingFormControl;
}

export function WelcomeOnboardingStep({ control }: WelcomeOnboardingStepProps) {
  const { colors } = useColorScheme();
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 1000, easing: Easing.linear }),
        withTiming(-20, { duration: 1000, easing: Easing.linear })
      ),
      -1,
      true
    );
  }, [rotation]);

  return (
    <View className='flex-1 p-5'>
      <Animated.View
        entering={FadeIn.delay(300)}
        className='mb-5 mt-[20vw] items-center'
        style={animatedStyle}>
        <Ionicons size={64} name='beer-outline' color={colors.primary} />
      </Animated.View>
      <AnimatedText
        entering={FadeInDown.delay(600)}
        variant='title1'
        className='mb-4 text-center font-bold'>
        Welcome to Drinkweise!
      </AnimatedText>
      <AnimatedText
        entering={FadeInDown.delay(900)}
        className='text-center text-gray-600 dark:text-gray-400'>
        Track your drinks, understand your habits, and maintain a healthy relationship with alcohol.
      </AnimatedText>
      <Animated.View entering={FadeInDown.delay(1200)} className='p-6'>
        <Controller
          control={control}
          name='username'
          render={({ field: { ref, onBlur, onChange, value }, fieldState: { error } }) => (
            <TextInput
              ref={ref}
              label='What should we call you?'
              labelClassName='mb-2 text-lg font-semibold text-gray-900'
              placeholder='Enter a username'
              value={value}
              onBlur={onBlur}
              onChangeText={(text) => onChange(text.trimEnd())}
              errorMessage={error?.message}
            />
          )}
        />
      </Animated.View>
    </View>
  );
}
