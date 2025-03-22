import { DetailsOnboardingStep } from '@drinkweise/components/onboarding/DetailsOnboardingStep';
import { Dot } from '@drinkweise/components/onboarding/Dot';
import { WelcomeOnboardingStep } from '@drinkweise/components/onboarding/WelcomeOnboardingStep';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import {
  ONBOARDING_STEPS,
  type OnboardingStep,
  useOnboardingForm,
} from '@drinkweise/lib/forms/onboarding';
import { never } from '@drinkweise/lib/utils/never';
import React, { ReactElement, useCallback, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  useWindowDimensions,
  View,
  type ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingPage() {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('WELCOME');
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useOnboardingForm();

  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'WELCOME':
        return !!errors.username;
      case 'DETAILS':
        return !!errors.height || !!errors.weight || !!errors.gender;
      case 'COMPLETE':
        return false;
      default:
        return never(currentStep);
    }
  }, [currentStep, errors]);

  const renderOnboardingStep = useCallback(
    (onboardingStep: OnboardingStep): ReactElement => {
      switch (onboardingStep) {
        case 'WELCOME':
          return <WelcomeOnboardingStep control={control} />;
        case 'DETAILS':
          return <DetailsOnboardingStep control={control} />;
        case 'COMPLETE':
          return (
            <View className='flex-1 items-center justify-center' style={{ width }}>
              <Text variant='largeTitle'>{onboardingStep} Page</Text>
            </View>
          );
      }
    },
    [width, control]
  );

  const navigateToNextStep = useCallback(async (): Promise<void> => {
    let isValid = false;

    switch (currentStep) {
      case 'WELCOME':
        isValid = await trigger(['username']);
        break;
      case 'DETAILS':
        isValid = await trigger(['height', 'weight', 'gender']);
        break;
      case 'COMPLETE':
        break;
      default:
        never(currentStep);
    }

    const step = ONBOARDING_STEPS[currentStep];

    if (isValid && step < Object.keys(ONBOARDING_STEPS).length - 1) {
      console.log('scrolling to next step');
      flatListRef.current?.scrollToIndex({ index: ONBOARDING_STEPS[currentStep] + 1 });
      return;
    }

    // TODO: Handle form submission this is going to be implemented in DRINK-16
    handleSubmit((data) => {
      console.log('form submitted', data);
    });
  }, [currentStep, trigger, handleSubmit]);

  const handleOnboardingStepSwipe = useCallback(
    async ({ viewableItems }: { viewableItems: ViewToken<OnboardingStep>[] }) => {
      const viewableItem = viewableItems[0];

      if (!viewableItem) {
        return;
      }

      const swipingToStep = ONBOARDING_STEPS[viewableItem.item];
      const step = ONBOARDING_STEPS[currentStep];

      if (swipingToStep === step) {
        return;
      }

      // Always allow swiping back
      if (swipingToStep < step) {
        setCurrentStep(viewableItem.item);
        return;
      }

      let isValid = false;

      switch (currentStep) {
        case 'WELCOME':
          isValid = await trigger(['username']);
          break;
        case 'DETAILS':
          isValid = await trigger(['height', 'weight', 'gender']);
          break;
        case 'COMPLETE':
          break;
        default:
          never(currentStep);
      }

      if (isValid) {
        setCurrentStep(viewableItem.item);
      } else {
        flatListRef.current?.scrollToIndex({ index: step });
        Alert.alert('Please fill out the form, before continuing');
      }
    },
    [currentStep, trigger]
  );

  const backButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(x.value, [0, width], [0, 1]),
    };
  });

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <View className='flex-1'>
        <Animated.FlatList
          ref={flatListRef}
          data={Object.keys(ONBOARDING_STEPS) as OnboardingStep[]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          initialScrollIndex={1}
          onScroll={onScroll}
          onScrollToIndexFailed={async (info) => {
            console.log('scroll to index failed', info);
            await new Promise((resolve) => setTimeout(resolve, 100));
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          }}
          onViewableItemsChanged={handleOnboardingStepSwipe}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 75 }}
          snapToInterval={width}
          bounces={false}
          decelerationRate='fast'
          overScrollMode='never'
          renderItem={({ item }) => (
            <View key={item} className='flex-1' style={{ width }}>
              {renderOnboardingStep(item)}
            </View>
          )}
        />
        <Animated.View entering={FadeInDown.delay(1100)}>
          <View className='flex-row justify-center gap-3 pb-5'>
            {Object.keys(ONBOARDING_STEPS).map((key, index) => (
              <Dot key={key} index={index} x={x} screenWidth={width} />
            ))}
          </View>
          <View className='flex-row items-stretch justify-between gap-3 px-5 pb-3'>
            <Animated.View style={backButtonAnimatedStyle}>
              <Button
                variant='tonal'
                onPress={() => {
                  const step = ONBOARDING_STEPS[currentStep];
                  if (step === 0) {
                    return;
                  }
                  flatListRef.current?.scrollToIndex({ index: step - 1 });
                }}>
                <Text className='flex-shrink-0'>Back</Text>
              </Button>
            </Animated.View>
            <Button
              className='flex-1'
              loading={isSubmitting}
              onPress={navigateToNextStep}
              disabled={validateCurrentStep()}>
              <Text>Continue</Text>
            </Button>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
