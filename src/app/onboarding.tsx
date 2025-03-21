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
import { FlatList, Platform, StatusBar, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
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

  const { control, trigger, handleSubmit } = useOnboardingForm();

  const renderOnboardingStep = useCallback(
    (onboardingStep: OnboardingStep): ReactElement => {
      switch (onboardingStep) {
        case 'WELCOME':
          return <WelcomeOnboardingStep control={control} />;
        case 'DETAILS':
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

    handleSubmit((data) => {
      console.log('form submitted', data);
    });

    // TODO: Handle form submission this is going to be implemented in DRINK-16
  }, [currentStep, trigger, handleSubmit]);

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
          initialScrollIndex={0}
          onScroll={onScroll}
          onScrollToIndexFailed={async (info) => {
            console.log('scroll to index failed', info);
            await new Promise((resolve) => setTimeout(resolve, 100));
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          }}
          onViewableItemsChanged={({ viewableItems }) => {
            const viewableItem = viewableItems[0];
            if (!viewableItem) {
              return;
            }
            setCurrentStep(viewableItem.item);
          }}
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
        <View className='flex-row justify-center gap-3 pb-5'>
          {Object.keys(ONBOARDING_STEPS).map((key, index) => (
            <Dot key={key} index={index} x={x} screenWidth={width} />
          ))}
        </View>
        <View className='flex-row items-stretch justify-between gap-3 px-5 pb-3'>
          <Button
            variant='tonal'
            onPress={() => {
              const step = ONBOARDING_STEPS[currentStep];
              if (step === 0) {
                return;
              }
              flatListRef.current?.scrollToIndex({ index: step - 1 });
            }}>
            <Text>Back</Text>
          </Button>
          <Button className='flex-1' onPress={navigateToNextStep}>
            <Text>Continue</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
