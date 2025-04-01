import { Text } from '@drinkweise/components/ui/Text';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

import { Avatar } from '../ui/Avatar';
import { DrinkAvatarFallback } from './add/DrinkAvatarFallback';

interface DrinkSessionDrinkItemProps {
  drink: DrinkModel;
}

export function DrinkSessionDrinkItem({ drink }: DrinkSessionDrinkItemProps) {
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
            console.log('Delete drink');
          }}>
          <Ionicons className='text-2xl text-destructive' name='trash-outline' />
        </TouchableOpacity>
      </View>
    </View>
  );
}
