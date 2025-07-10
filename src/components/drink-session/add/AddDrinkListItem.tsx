import { DrinkAvatarFallback } from '@drinkweise/components/shared/DrinkAvatarFallback';
import { Avatar } from '@drinkweise/components/ui/Avatar';
import { Text } from '@drinkweise/components/ui/Text';
import { never } from '@drinkweise/lib/utils/never';
import { useAppDispatch } from '@drinkweise/store';
import { addDrinkAction } from '@drinkweise/store/drink-session';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';
import { useRouter } from 'expo-router';
import { useMemo, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface DrinkListProps {
  drink: AddDrinkModel;
}

export const AddDrinkListItem = memo(function AddDrinkListItem({ drink }: DrinkListProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const mappedDrinkType = useMemo(() => {
    switch (drink.type) {
      case 'beer':
        return 'Beer';
      case 'spirit':
        return 'Spirit';
      case 'red-wine':
        return 'Red Wine';
      case 'white-wine':
        return 'White Wine';
      case 'other':
        return 'Other';
      default:
        never(drink.type);
    }
  }, [drink.type]);

  return (
    <TouchableOpacity
      className='border-b border-border bg-card'
      activeOpacity={0.6}
      onPress={() => {
        dispatch(addDrinkAction({ drink }));
        router.dismissTo('/drinks/session');
      }}>
      <View className='p-2'>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <Avatar className='mr-3 h-16 w-16' alt=''>
              <DrinkAvatarFallback type={drink.type} />
            </Avatar>
            <View className='flex-1 flex-row'>
              <View>
                <Text className='text-xl font-semibold'>{drink.name}</Text>
                <Text className='text-gray-800 dark:text-gray-200'>{mappedDrinkType}</Text>
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
      </View>
    </TouchableOpacity>
  );
});
