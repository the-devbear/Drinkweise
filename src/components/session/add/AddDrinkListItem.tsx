import { Avatar } from '@drinkweise/components/ui/Avatar';
import { Text } from '@drinkweise/components/ui/Text';
import type { Drink } from '@drinkweise/store/drink-session/models/drink.model';
import { TouchableOpacity, View } from 'react-native';

import { DrinkAvatarFallback } from './DrinkAvatarFallback';

interface DrinkListProps {
  drink: Omit<Drink, 'consumptions'>;
}

export function AddDrinkListItem({ drink }: DrinkListProps) {
  return (
    <TouchableOpacity className=' border-b border-border bg-card' activeOpacity={0.6}>
      <View className='p-2'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <Avatar className='mr-3 h-16 w-16' alt=''>
              <DrinkAvatarFallback type={drink.type} />
            </Avatar>
            <View>
              <Text className='text-xl font-semibold'>{drink.name}</Text>
              <Text className='text-gray-800 dark:text-gray-200'>{drink.type}</Text>
            </View>
          </View>
          <View>
            <Text className='text-right text-lg text-gray-800 dark:text-gray-200'>
              {drink.alcohol}% alcohol
            </Text>
            <Text className='text-right text-lg text-gray-800 dark:text-gray-200'>
              {drink.defaultVolume} ml
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
