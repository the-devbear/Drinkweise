import { cn } from '@drinkweise/lib/cn';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

type DotProps = {
  className?: string;
  index: number;
  x: SharedValue<number>;
  screenWidth: number;
  size?: number;
};

export function Dot({ className, index, x, screenWidth, size = 15 }: DotProps) {
  const { colors } = useColorScheme();
  const animatedDotStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
      [size, size * 2, size],
      Extrapolation.CLAMP
    );

    const backgroundColorAnimation = interpolateColor(
      x.value,
      [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth],
      [colors.grey2, colors.primary, colors.primary]
    );

    return {
      width: widthAnimation,
      backgroundColor: backgroundColorAnimation,
    };
  });

  return (
    <Animated.View
      className={cn('h-3 rounded-full bg-slate-600', className)}
      style={animatedDotStyle}
    />
  );
}
