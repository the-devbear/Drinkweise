import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { useAppDispatch } from '@drinkweise/store';
import { removeConsumptionAction } from '@drinkweise/store/drink-session';
import type { DrinkConsumptionModel } from '@drinkweise/store/drink-session/models/consumption.model';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface ConsumptionItemProps {
  drinkId: string;
  consumption: DrinkConsumptionModel;
  index: number;
}

export function ConsumptionItem({ drinkId, consumption, index }: ConsumptionItemProps) {
  const dispatch = useAppDispatch();
  return (
    <View
      className={cn('flex-row items-center justify-between px-3 py-2', {
        'bg-card': index % 2 === 0,
      })}>
      <Text variant='title3' className='flex-1 text-center'>
        {index + 1}.
      </Text>
      <Text className='flex-[2] text-center'>{consumption.volume}</Text>
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
