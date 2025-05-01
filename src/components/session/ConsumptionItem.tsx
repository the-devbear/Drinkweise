import { DeleteSwipeable } from '@drinkweise/components/ui/DeleteSwipeable';
import { IntegerInput } from '@drinkweise/components/ui/IntegerInput';
import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import {
  calculateEndTimeForConsumption,
  calculateStartTimeForConsumption,
} from '@drinkweise/lib/drink-session/calculate-timestamps-for-consumption';
import { useAppDispatch } from '@drinkweise/store';
import {
  finishConsumptionAction,
  removeConsumptionAction,
  updateConsumptionAction,
} from '@drinkweise/store/drink-session';
import type { DrinkConsumptionModel } from '@drinkweise/store/drink-session/models/consumption.model';
import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { TimePicker } from './TimePicker';

interface ConsumptionItemProps {
  drinkId: string;
  drinkDefaultVolume: number;
  consumption: DrinkConsumptionModel;
  index: number;
}

const TimePickerWithDate = memo(function TimePickerWithDate({
  date,
  isEven,
  onChange,
}: {
  date: Date;
  isEven: boolean;
  onChange: (event: { type: string; nativeEvent: { timestamp: number } }) => void;
}) {
  return (
    <View>
      <View className='absolute -right-1 -top-1 z-10'>
        <Text
          className={cn(
            'aspect-square self-center rounded-full bg-background p-[1px] text-center text-xs font-semibold text-primary',
            {
              'bg-card': isEven,
            }
          )}>
          {date.getDate()}
        </Text>
      </View>
      <TimePicker value={date} onChange={onChange} />
    </View>
  );
});

const FinishButton = memo(function FinishButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      className='h-6 w-6 items-center justify-center rounded-md border border-primary'
      onPress={onPress}>
      <Ionicons name='checkmark' className='text-lg leading-none text-primary' />
    </TouchableOpacity>
  );
});

export const ConsumptionItem = memo(function ConsumptionItem({
  drinkId,
  drinkDefaultVolume,
  consumption,
  index,
}: ConsumptionItemProps) {
  const dispatch = useAppDispatch();
  const updateConsumption = useCallback(
    (updatedConsumption: Partial<DrinkConsumptionModel>) => {
      dispatch(
        updateConsumptionAction({
          drinkId,
          consumptionIndex: index,
          updatedConsumption,
        })
      );
    },
    [dispatch, drinkId, index]
  );

  const handleDelete = useCallback(() => {
    dispatch(removeConsumptionAction({ drinkId, consumptionIndex: index }));
  }, [dispatch, drinkId, index]);

  const handleFinish = useCallback(() => {
    dispatch(finishConsumptionAction({ drinkId, consumptionIndex: index }));
  }, [dispatch, drinkId, index]);

  const consumptionStartTimeDate = useMemo(
    () => new Date(consumption.startTime),
    [consumption.startTime]
  );
  const consumptionEndTimeDate = useMemo(
    () => (consumption.endTime !== undefined ? new Date(consumption.endTime) : new Date()),
    [consumption.endTime]
  );

  const handleStartTimeChange = useCallback(
    ({
      type,
      nativeEvent: { timestamp },
    }: {
      type: string;
      nativeEvent: { timestamp: number };
    }) => {
      if (type !== 'set') {
        return;
      }

      const { startTime, endTime } = calculateStartTimeForConsumption(
        timestamp,
        consumption.startTime,
        consumption.endTime
      );

      updateConsumption({
        startTime,
        endTime,
      });
    },
    [consumption.startTime, consumption.endTime, updateConsumption]
  );

  const handleEndTimeChange = useCallback(
    ({
      type,
      nativeEvent: { timestamp },
    }: {
      type: string;
      nativeEvent: { timestamp: number };
    }) => {
      if (type !== 'set') {
        return;
      }

      const endTime = calculateEndTimeForConsumption(
        timestamp,
        consumption.endTime!,
        consumption.startTime
      );

      updateConsumption({
        endTime,
      });
    },
    [consumption.endTime, consumption.startTime, updateConsumption]
  );

  const handleVolumeChange = useCallback(
    (value?: number) => {
      updateConsumption({
        volume: value ?? drinkDefaultVolume,
      });
    },
    [drinkDefaultVolume, updateConsumption]
  );

  const isEven = index % 2 === 0;

  return (
    <DeleteSwipeable onDelete={handleDelete}>
      <View
        className={cn('flex-row items-center py-2', {
          'bg-card': isEven,
        })}>
        <Text variant='title3' className='flex-1 text-center'>
          {index + 1}.
        </Text>
        <View className='flex-[2]'>
          <IntegerInput
            variant='none'
            className='px-2'
            containerClassName='py-0 h-10 border border-border'
            inputClassName='text-center text-lg'
            initialValue={consumption.volume}
            placeholder={drinkDefaultVolume.toString()}
            onEndEditing={handleVolumeChange}
          />
        </View>
        <View className='flex-[2] items-center'>
          <TimePickerWithDate
            date={consumptionStartTimeDate}
            isEven={isEven}
            onChange={handleStartTimeChange}
          />
        </View>
        <View className='flex-[2] items-center'>
          {consumption.endTime ? (
            <TimePickerWithDate
              date={consumptionEndTimeDate}
              isEven={isEven}
              onChange={handleEndTimeChange}
            />
          ) : (
            <FinishButton onPress={handleFinish} />
          )}
        </View>
      </View>
      {consumption.endTime && consumption.startTime > consumption.endTime && (
        <Text className='pl-3 text-sm text-destructive'>Start time is after end time!</Text>
      )}
    </DeleteSwipeable>
  );
});
