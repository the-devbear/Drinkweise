import { SessionDurationTicker } from '@drinkweise/components/session/complete/SessionDurationTicker';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { calculateSoberTime } from '@drinkweise/lib/drink-session/calculate-sober-time';
import { calculateTotalGrammsOfAlcoholConsumed } from '@drinkweise/lib/drink-session/calculate-total-gramms-of-alcohol-consumed';
import { dateFormatterWithoutYear } from '@drinkweise/lib/utils/date/date-formatters';
import { roundedNumberFormatter } from '@drinkweise/lib/utils/number/number-formatters';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import {
  activeDrinkSessionSelector,
  updateSessionNameAction,
  updateSessionNoteAction,
} from '@drinkweise/store/drink-session';
import { completeDrinkSessionAction } from '@drinkweise/store/drink-session/actions/complete-drink-session.action';
import { userWeightSelector } from '@drinkweise/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const completeDrinkSessionSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(255, 'Name is too long, max 255 characters'),
  note: z.string().max(500, 'Note is too long, max 500 characters').optional(),
});

export default function CompleteDrinkSessionPage() {
  const drinkSession = useAppSelector(activeDrinkSessionSelector);
  const userWeight = useAppSelector(userWeightSelector);
  const dispatch = useAppDispatch();
  const totalAlcoholConsumed = useMemo(
    () => calculateTotalGrammsOfAlcoholConsumed(drinkSession?.drinks ?? []),
    [drinkSession?.drinks]
  );
  const soberTime = useMemo(
    () => calculateSoberTime(totalAlcoholConsumed, userWeight, drinkSession?.startTime),
    [totalAlcoholConsumed, userWeight, drinkSession?.startTime]
  );

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting, defaultValues, isValid, isSubmitted },
  } = useForm({
    defaultValues: {
      name: drinkSession?.name === '' ? undefined : drinkSession?.name,
      note: drinkSession?.note === '' ? undefined : drinkSession?.note,
    },
    resolver: zodResolver(completeDrinkSessionSchema),
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.debug('Unsubscribing from focus effect');
        const values = getValues();
        if (values.name !== defaultValues?.name) {
          dispatch(updateSessionNameAction({ name: values.name }));
        }
        if (values.note !== defaultValues?.note) {
          dispatch(updateSessionNoteAction({ note: values.note ?? '' }));
        }
      };
    }, [dispatch, getValues, defaultValues])
  );

  const onSubmit = handleSubmit(async (data) => {
    const result = await dispatch(
      completeDrinkSessionAction({
        ...data,
      })
    );

    if (completeDrinkSessionAction.rejected.match(result)) {
      Alert.alert('Error', 'An error occurred while completing the session. Please try again.', [
        {
          text: 'OK',
        },
      ]);
    }
  });

  if (!drinkSession) {
    return <Redirect href='/drinks' />;
  }

  return (
    <ScrollView className='flex-1 pt-5' keyboardDismissMode='on-drag'>
      <View className='px-3'>
        <Controller
          control={control}
          name='name'
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <TextInput
              size='lg'
              inputClassName='font-semibold text-lg'
              placeholder='Give your session a memorable name'
              clearButtonMode='while-editing'
              defaultValue={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={error?.message}
            />
          )}
        />
        <View className='flex-row items-center gap-5 pt-3'>
          <TouchableOpacity
            className='flex-1 rounded-md bg-card px-2 py-1'
            onPress={() => {
              Alert.alert(
                'Duration',
                'This is the duration of your session. It shows how long you have been drinking.',
                [
                  {
                    text: 'OK',
                  },
                ]
              );
            }}>
            <Text className='text-center text-sm font-semibold'>Duration</Text>
            <SessionDurationTicker startTime={drinkSession.startTime} />
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 rounded-md bg-card px-2 py-1'
            onPress={() => {
              Alert.alert(
                'Total Alcohol',
                'This is the total amount of alcohol you have consumed during this session.',
                [
                  {
                    text: 'OK',
                  },
                ]
              );
            }}>
            <Text className='text-center text-sm font-semibold'>Total Alcohol</Text>
            <Text className='text-center text-sm'>
              {roundedNumberFormatter.format(totalAlcoholConsumed)}g
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 rounded-lg bg-card px-2 py-1'
            onPress={() => {
              Alert.alert(
                'Sober Time',
                'This is the time when you will be sober again. It is calculated based on the amount of alcohol you have consumed and your weight.\n\n' +
                  'The body eliminates alcohol at a rate of about 0.1g per kg of body weight per hour.',
                [
                  {
                    text: 'OK',
                  },
                ]
              );
            }}>
            <Text className='text-center text-sm font-semibold'>Sober time</Text>
            <Text className='text-center text-sm'>
              {typeof soberTime === 'string'
                ? soberTime
                : dateFormatterWithoutYear.format(soberTime)}
            </Text>
          </TouchableOpacity>
        </View>
        <Controller
          control={control}
          name='note'
          render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
            <View>
              <TextInput
                label='Note:'
                multiline
                defaultValue={value}
                className='mt-2'
                containerClassName='h-auto'
                inputClassName='min-h-24 text-start align-top text-[16px]'
                placeholder='How was your session? Leave a note here...'
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
              />
              {error?.message === undefined && (
                <Text className='mr-2 mt-1 self-end text-xs text-muted-foreground'>
                  {value?.length ?? 0} / 500 characters
                </Text>
              )}
            </View>
          )}
        />
      </View>
      <Button
        className='mx-3 mt-4'
        disabled={!isValid && isSubmitted}
        loading={isSubmitting}
        onPress={onSubmit}>
        <Text>Complete</Text>
      </Button>
    </ScrollView>
  );
}
