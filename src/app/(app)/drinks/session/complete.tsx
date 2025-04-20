import { SessionDurationTicker } from '@drinkweise/components/session/complete/SessionDurationTicker';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { calculateSoberTime } from '@drinkweise/lib/drink-session/calculate-sober-time';
import { calculateTotalGrammsOfAlcoholConsumed } from '@drinkweise/lib/drink-session/calculate-total-gramms-of-alcohol-consumed';
import { dateFormatterWithoutYear } from '@drinkweise/lib/utils/date/date-formatters';
import { roundedNumberFormatter } from '@drinkweise/lib/utils/number/number-formatters';
import { useAppSelector } from '@drinkweise/store';
import { activeDrinkSessionSelector } from '@drinkweise/store/drink-session';
import { userWeightSelector } from '@drinkweise/store/user';
import { Redirect } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

export default function CompleteDrinkSessionPage() {
  const drinkSession = useAppSelector(activeDrinkSessionSelector);
  const userWeight = useAppSelector(userWeightSelector);
  const totalAlcoholConsumed = useMemo(
    () => calculateTotalGrammsOfAlcoholConsumed(drinkSession?.drinks ?? []),
    [drinkSession?.drinks]
  );
  const soberTime = useMemo(
    () => calculateSoberTime(totalAlcoholConsumed, userWeight, drinkSession?.startTime),
    [totalAlcoholConsumed, userWeight, drinkSession?.startTime]
  );

  if (!drinkSession) {
    return <Redirect href='/drinks/session' />;
  }

  return (
    <ScrollView className='flex-1 pt-5' keyboardDismissMode='on-drag'>
      <View className='px-3'>
        <TextInput
          size='lg'
          inputClassName='font-semibold text-lg'
          placeholder='Give your session a memorable name'
          clearButtonMode='while-editing'
        />
        <View className='flex-row items-center gap-5 pt-3'>
          <View className='flex-1 rounded-md bg-card px-2 py-1'>
            <Text className='text-center text-sm font-semibold'>Duration</Text>
            <SessionDurationTicker startTime={drinkSession.startTime} />
          </View>
          <View className='flex-1 rounded-md bg-card px-2 py-1'>
            <Text className='text-center text-sm font-semibold'>Total Alcohol</Text>
            <Text className='text-center text-sm'>
              {roundedNumberFormatter.format(totalAlcoholConsumed)}g
            </Text>
          </View>
          <View className='flex-1 rounded-lg bg-card px-2 py-1'>
            <Text className='text-center text-sm font-semibold'>Sober time</Text>
            <Text className='text-center text-sm'>
              {typeof soberTime === 'string'
                ? soberTime
                : dateFormatterWithoutYear.format(soberTime)}
            </Text>
          </View>
        </View>
        <TextInput
          label='Note:'
          multiline
          className='mt-2'
          containerClassName='h-auto'
          inputClassName='min-h-24 text-start align-top text-[16px]'
          placeholder='How was your session? Leave a note here...'
        />
      </View>
      <Button className='mx-3 mt-4'>
        <Text>Complete</Text>
      </Button>
    </ScrollView>
  );
}
