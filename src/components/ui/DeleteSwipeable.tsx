import { Ionicons } from '@expo/vector-icons';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface DeleteSwipeableProps {
  children: React.ReactNode;
  /**
   * A percentage of the screen width that needs to be swiped to trigger the delete action.
   * @default 0.4
   */
  deleteThreshold?: number;
  /**
   * A function to be called when the delete action is triggered.
   */
  onDelete?: () => void;
}
const SCREEN_WIDTH = Dimensions.get('window').width;

export function DeleteSwipeable({
  children,
  deleteThreshold = 0.4,
  onDelete,
}: DeleteSwipeableProps) {
  const swipeTranslateX = useSharedValue(0);
  const reachedDeleteThreshold = useDerivedValue(
    () => swipeTranslateX.value < -SCREEN_WIDTH * deleteThreshold
  );

  const handleDelete = () => {
    onDelete?.();
  };

  const panHandler = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onChange((event) => {
      if (swipeTranslateX.value < 0 || event.translationX < 0) {
        swipeTranslateX.value = event.translationX;
      }
    })
    .onFinalize(() => {
      if (reachedDeleteThreshold.value) {
        swipeTranslateX.value = withTiming(-SCREEN_WIDTH, undefined, (finished) => {
          if (finished) {
            runOnJS(handleDelete)();
          }
        });
      } else {
        swipeTranslateX.value = withTiming(0);
      }
    });

  const swipeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: swipeTranslateX.value,
        },
      ],
    };
  });

  const deleteButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: swipeTranslateX.value + SCREEN_WIDTH,
        },
      ],
    };
  });

  const animatedDeleteTextWrapperStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: reachedDeleteThreshold.value ? withTiming(1.3) : withTiming(1),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panHandler}>
      <View>
        <Animated.View className='z-10' style={swipeStyle}>
          {children}
        </Animated.View>
        <Animated.View
          className='absolute right-0 z-0 h-full w-full items-start justify-center bg-destructive pl-4'
          style={deleteButtonStyle}>
          <Animated.View style={animatedDeleteTextWrapperStyles}>
            <Ionicons name='trash' className='text-2xl text-white' />
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
