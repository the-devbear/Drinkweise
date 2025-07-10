import { calculateSessionDuration } from '@drinkweise/lib/drink-session/calculate-session-duration';
import { calculateGramsOfAlcohol } from '@drinkweise/lib/utils/calculations/calculate-grams-of-alcohol';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { roundedNumberFormatter } from '@drinkweise/lib/utils/number/number-formatters';
import { Card, CardHeader, CardContent, CardTitle } from '@drinkweise/ui/Card';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { memo, useMemo } from 'react';
import { View } from 'react-native';

interface SessionSummaryCardProps {
  sessionStartTime: Date;
  sessionEndTime: Date;
  consumptions: { volume: number; alcohol: number }[];
}

export const SessionSummaryCard = memo(function SessionSummaryCard({
  sessionStartTime,
  sessionEndTime,
  consumptions,
}: SessionSummaryCardProps) {
  const formattedSessionStartTime = useMemo(
    () => shortTimeFormatter.format(sessionStartTime),
    [sessionStartTime]
  );
  const formattedSessionEndTime = useMemo(
    () => shortTimeFormatter.format(sessionEndTime),
    [sessionEndTime]
  );
  const formattedSessionDuration = useMemo(
    () => calculateSessionDuration(sessionStartTime.getTime(), sessionEndTime.getTime()),
    [sessionStartTime, sessionEndTime]
  );
  const totalVolumeConsumed = useMemo(
    () =>
      roundedNumberFormatter.format(
        consumptions.reduce(
          (totalVolume, currentConsumption) => totalVolume + currentConsumption.volume,
          0
        )
      ),
    [consumptions]
  );
  const totalAlcoholConsumed = useMemo(
    () =>
      roundedNumberFormatter.format(
        consumptions.reduce(
          (totalAlcohol, currentConsumption) =>
            totalAlcohol +
            calculateGramsOfAlcohol(currentConsumption.volume, currentConsumption.alcohol),
          0
        )
      ),
    [consumptions]
  );

  return (
    <Card className='mx-4'>
      <CardHeader>
        <CardTitle className='font-bold text-gray-600 dark:text-gray-300'>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <View className='flex'>
          <View className='flex-row justify-around'>
            <View className='items-center'>
              <Text className='text-xs uppercase text-gray-500 dark:text-gray-400'>Start</Text>
              <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                {formattedSessionStartTime}
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-xs uppercase text-gray-500 dark:text-gray-400'>End</Text>
              <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                {formattedSessionEndTime}
              </Text>
            </View>
            <View className='items-center'>
              <Text className='text-xs uppercase text-gray-500 dark:text-gray-400'>Duration</Text>
              <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                {formattedSessionDuration}
              </Text>
            </View>
          </View>
          <View className='mt-3 flex-row gap-3'>
            <View className='flex-1 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50'>
              <View className='flex-row items-center'>
                <Ionicons
                  name='water-outline'
                  className='mr-2 text-[20px] text-blue-600 dark:text-blue-400'
                />
                <Text className='text-sm text-gray-600 dark:text-gray-300'>Total Volume</Text>
              </View>
              <Text className='mt-1 text-lg font-bold text-gray-900 dark:text-white'>
                {totalVolumeConsumed} ml
              </Text>
            </View>
            <View className='flex-1 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/50'>
              <View className='flex-row items-center'>
                <Ionicons
                  name='wine-outline'
                  className='mr-2 text-[20px] text-blue-600 dark:text-blue-400'
                />
                <Text className='text-sm text-gray-600 dark:text-gray-300'>Total Alcohol</Text>
              </View>
              <Text className='mt-1 text-lg font-bold text-gray-900 dark:text-white'>
                {totalAlcoholConsumed}g
              </Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
});
