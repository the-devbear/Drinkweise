import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

interface ExpandableDetailsInfoCardProps {
  infoExpanded: boolean;
  setInfoExpanded: (expanded: boolean) => void;
}

export function ExpandableDetailsInfoCard({
  infoExpanded,
  setInfoExpanded,
}: ExpandableDetailsInfoCardProps) {
  const expansionValue = useSharedValue(0);

  const bulletPoints = useMemo(
    () => [
      'Height, weight and gender directly affect how alcohol impacts your body',
      'These factors are crucial for accurate Blood Alcohol Concentration (BAC) calculations',
      'Providing your actual measurements gives you personalized, more precise results',
      'You can use average values if preferred, though results will be less accurate',
      'Your data is used only for BAC calculations and stored securely',
    ],
    []
  );

  useEffect(() => {
    expansionValue.value = withTiming(infoExpanded ? 1 : 0, { duration: 500 });
  }, [expansionValue, infoExpanded]);

  const infoContentStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(expansionValue.value, [0, 1], [0, 500]),
      overflow: 'hidden',
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(expansionValue.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });
  return (
    <TouchableOpacity onPress={() => setInfoExpanded(!infoExpanded)} activeOpacity={0.8}>
      <View className='rounded-lg bg-blue-400/30 p-3'>
        <View className='flex-row items-center justify-between'>
          <Text variant='heading'>Why do we need this information?</Text>
          <Animated.View style={iconStyle}>
            <Ionicons name='chevron-up' className='text-xl text-foreground' />
          </Animated.View>
        </View>
        <Animated.View style={infoContentStyle}>
          <View className='gap-2 pl-2 pt-2'>
            {bulletPoints.map((item) => (
              <View className='flex-row items-start' key={item}>
                <Text className='mr-2 text-3xl text-primary'>{'\u2022'}</Text>
                <Text className='flex-1 text-sm text-gray-800 dark:text-gray-200'>{item}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
