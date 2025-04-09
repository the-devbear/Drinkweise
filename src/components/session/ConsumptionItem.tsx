import { IntegerInput } from '@drinkweise/components/ui/IntegerInput';
import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { useAppDispatch } from '@drinkweise/store';
import { updateConsumptionAction } from '@drinkweise/store/drink-session';
import type { DrinkConsumptionModel } from '@drinkweise/store/drink-session/models/consumption.model';
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
  return (
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
            dispatch(
              updateConsumptionAction({
                drinkId,
                consumptionIndex: index,
                updatedConsumption: {
                  volume: value ?? 0,
                },
              })
            )
          }
        />
      </View>
      <View className='flex-[2] items-center'>
        <TimePicker
          value={new Date(consumption.startTime)}
          onChange={({ type, nativeEvent: { timestamp } }) => {
            if (type !== 'set') {
              return;
            }
            dispatch(
              updateConsumptionAction({
                drinkId,
                consumptionIndex: index,
                updatedConsumption: {
                  startTime: timestamp,
                },
              })
            );
          }}
        />
      </View>
      <View className='flex-[2] items-center'>
        {consumption.endTime ? (
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

              dispatch(
                updateConsumptionAction({
                  drinkId,
                  consumptionIndex: index,
                  updatedConsumption: {
                    endTime: timestamp,
                  },
                })
              );
            }}
          />
        ) : (
          <TouchableOpacity
            className='h-6 w-6 items-center justify-center rounded-md border border-primary'
            onPress={() => {
              dispatch(
                updateConsumptionAction({
                  drinkId,
                  consumptionIndex: index,
                  updatedConsumption: {
                    endTime: new Date().getTime(),
                  },
                })
              );
            }}
          />
        )}
      </View>
    </View>
  );
}
