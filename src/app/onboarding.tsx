import { Dot } from '@drinkweise/components/onboarding/Dot';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useRef } from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingPage() {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const step = useSharedValue(1);
  const x = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <View className='flex-1'>
        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyboardDismissMode='on-drag'
          initialScrollIndex={step as SharedValue<number | null | undefined>}
          onScroll={onScroll}
          onScrollToIndexFailed={async (info) => {
            console.log('scroll to index failed', info);
            await new Promise((resolve) => setTimeout(resolve, 100));
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          }}
          onViewableItemsChanged={({ viewableItems }) => {
            if (viewableItems.length !== 1) {
              return;
            }
            step.value = viewableItems[0]?.index ?? 0;
          }}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 75 }}
          snapToInterval={width}
          data={['Welcome', 'Details', 'Complete']}
          bounces={false}
          decelerationRate='fast'
          overScrollMode='never'
          renderItem={({ item }) => (
            <View className='flex-1 items-center justify-center' style={{ width }}>
              <Text variant='largeTitle'>{item} Page</Text>
            </View>
          )}
        />
        <View className='flex-row justify-center gap-3 pb-5'>
          {Array.from({ length: 3 }).map((_, index) => (
            <TouchableOpacity
              key={index}
              hitSlop={{ top: 15, right: 4, bottom: 15, left: 4 }}
              onPress={() => {
                flatListRef.current?.scrollToIndex({ index });
              }}>
              <Dot index={index} x={x} screenWidth={width} isCompleted={index <= 1} />
            </TouchableOpacity>
          ))}
        </View>
        <View className='flex-row items-stretch justify-between gap-3 px-5 pb-3'>
          <Button
            variant='tonal'
            onPress={() => flatListRef.current?.scrollToIndex({ index: step.value - 1 })}>
            <Text>Back</Text>
          </Button>
          <Button
            className='flex-1'
            onPress={() => flatListRef.current?.scrollToIndex({ index: step.value + 1 })}>
            <Text>Continue</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
