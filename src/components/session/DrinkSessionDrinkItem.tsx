import { Avatar } from '@drinkweise/components/ui/Avatar';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch } from '@drinkweise/store';
import { removeDrinkAction } from '@drinkweise/store/drink-session';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

import { DrinkAvatarFallback } from './add/DrinkAvatarFallback';

interface DrinkSessionDrinkItemProps {
  drink: DrinkModel;
}

export function DrinkSessionDrinkItem({ drink }: DrinkSessionDrinkItemProps) {
  const dispatch = useAppDispatch();
  return (
    <View className='flex gap-2 py-3'>
      <View className='flex-row justify-between gap-5 px-3'>
        <Avatar className='h-16 w-16' alt={drink.name}>
          <DrinkAvatarFallback type={drink.type} />
        </Avatar>
        <View className='flex-1 justify-center'>
          <Text variant='title2' className='font-bold'>
            {drink.name}
          </Text>
          <Text className='text-end text-sm'>{drink.alcohol} % alcohol</Text>
        </View>
        <TouchableOpacity
          className='self-center'
          onPress={() => {
            dispatch(removeDrinkAction({ drinkId: drink.id }));
          }}>
          <Ionicons className='text-2xl text-destructive' name='trash-outline' />
        </TouchableOpacity>
      </View>
      <View className='flex-row'>
        <Text className='flex-1 text-center'>Count</Text>
        <Text className='flex-[2] text-center'>Volume in ml</Text>
        <Text className='flex-[2] text-center'>Start Time</Text>
        <Text className='flex-[2] text-center'>End Time</Text>
      </View>
      {drink.consumptions.map((consumption, index) => (
        <View key={consumption.id} className='flex-row items-center justify-between'>
          <Text className='flex-1 text-center'>{index + 1}.</Text>
          <Text className='flex-[2] text-center'>{consumption.volume}</Text>
          <Text className='flex-[2] text-center'>
            {new Date(consumption.startTime).toLocaleTimeString('de-DE')}
          </Text>
          <Text className='flex-[2] text-center'>
            {new Date(consumption.endTime ?? -1).toLocaleTimeString('de-DE')}
          </Text>
        </View>
      ))}
    </View>
  );
}
