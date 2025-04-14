import { DeleteSwipeable } from '@drinkweise/components/ui/DeleteSwipeable';
import { IntegerInput } from '@drinkweise/components/ui/IntegerInput';
import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { now } from '@drinkweise/lib/utils/date/now';
import { useAppDispatch } from '@drinkweise/store';
import { removeConsumptionAction, updateConsumptionAction } from '@drinkweise/store/drink-session';
import type { DrinkConsumptionModel } from '@drinkweise/store/drink-session/models/consumption.model';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { TimePicker } from './TimePicker';

interface ConsumptionItemProps {
  drinkId: string;
  drinkDefaultVolume: number;
  consumption: DrinkConsumptionModel;
  index: number;
}

export function ConsumptionItem({
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

  const consumptionStartTimeDate = useMemo(
    () => new Date(consumption.startTime),
    [consumption.startTime]
  );
  const consumptionEndTimeDate = useMemo(
    () => (consumption.endTime !== undefined ? new Date(consumption.endTime) : new Date()),
    [consumption.endTime]
  );

  return (
    <DeleteSwipeable
      onDelete={() => {
        dispatch(removeConsumptionAction({ drinkId, consumptionIndex: index }));
      }}>
      <View
        className={cn('flex-row items-center py-2', {
          'bg-card': index % 2 === 0,
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
            onEndEditing={(value) =>
              updateConsumption({
                volume: value ?? 0,
              })
            }
          />
        </View>
        <View className='flex-[2] items-center'>
          <View>
            <View className='absolute -right-1 -top-1 z-10'>
              <Text
                className={cn(
                  'aspect-square self-center rounded-full bg-background p-[1px] text-center text-xs font-semibold text-primary',
                  {
                    'bg-card': index % 2 === 0,
                  }
                )}>
                {consumptionStartTimeDate.getDate()}
              </Text>
            </View>
          <TimePicker
            value={new Date(consumption.startTime)}
            onChange={({ type, nativeEvent: { timestamp } }) => {
              if (type !== 'set') {
                return;
              }
              updateConsumption({
                startTime: timestamp,
              });
            }}
          />
          </View>
        </View>
        <View className='flex-[2] items-center'>
          {consumption.endTime ? (
            <View>
              <View className='absolute -right-1 -top-1 z-10'>
                <Text
                  className={cn(
                    'aspect-square self-center rounded-full bg-background p-[1px] text-center text-xs font-semibold text-primary',
                    {
                      'bg-card': index % 2 === 0,
                    }
                  )}>
                  {consumptionEndTimeDate.getDate()}
                </Text>
                </View>
              <TimePicker
                value={new Date(consumption.endTime)}
                onChange={({ type, nativeEvent: { timestamp } }) => {
                  if (type !== 'set') {
                    return;
                  }

                  // TODO: Think of a better way to handle this
                  if (timestamp < consumption.startTime) {
                    return;
                  }

                  updateConsumption({
                    endTime: timestamp,
                  });
                }}
              />
            </View>
          ) : (
            <TouchableOpacity
              className='h-6 w-6 items-center justify-center rounded-md border border-primary'
              onPress={() => {
                updateConsumption({
                  endTime: now(),
                });
              }}>
              <Ionicons name='checkmark' className='text-lg leading-none text-primary' />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </DeleteSwipeable>
  );
}
