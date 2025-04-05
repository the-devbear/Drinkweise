import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { useAppDispatch } from '@drinkweise/store';
import { removeConsumptionAction, updateConsumptionAction } from '@drinkweise/store/drink-session';
import type { DrinkConsumptionModel } from '@drinkweise/store/drink-session/models/consumption.model';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { IntegerInput } from '../ui/IntegerInput';

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
      className={cn('flex-row items-center justify-between px-3 py-1', {
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
      <Text className='flex-[2] text-center'>
        {shortTimeFormatter.format(consumption.startTime)}
      </Text>
      <View className='flex-[2] items-center justify-center'>
        {consumption.endTime ? (
          <Text className='text-center'>{shortTimeFormatter.format(consumption.endTime)}</Text>
        ) : (
          <View className='h-6 w-6 items-center justify-center rounded-md border border-primary' />
        )}
      </View>
      <Ionicons
        className='text-xl text-destructive'
        name='trash-outline'
        onPress={() => dispatch(removeConsumptionAction({ drinkId, consumptionIndex: index }))}
      />
    </View>
  );
}
