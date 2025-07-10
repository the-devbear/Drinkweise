import { DrinkAvatarFallback } from '@drinkweise/components/shared/DrinkAvatarFallback';
import { Avatar } from '@drinkweise/components/ui/Avatar';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch } from '@drinkweise/store';
import { addConsumptionAction, removeDrinkAction } from '@drinkweise/store/drink-session';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';
import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';

import { ConsumptionItem } from './ConsumptionItem';

interface DrinkSessionDrinkItemProps {
  drink: DrinkModel;
}

const DrinkHeader = memo(function DrinkHeader({
  drink,
  onRemove,
}: {
  drink: DrinkModel;
  onRemove: () => void;
}) {
  return (
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
      <TouchableOpacity className='self-center' onPress={onRemove}>
        <Ionicons className='text-2xl text-destructive' name='trash-outline' />
      </TouchableOpacity>
    </View>
  );
});

export const DrinkSessionDrinkItem = memo(function DrinkSessionDrinkItem({
  drink,
}: DrinkSessionDrinkItemProps) {
  const dispatch = useAppDispatch();

  const handleRemove = useCallback(() => {
    Alert.alert(
      `Remove ${drink.name}`,
      `Are you sure you want to remove ${drink.name} from your session?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeDrinkAction({ drinkId: drink.id }));
          },
        },
      ]
    );
  }, [dispatch, drink.id, drink.name]);

  const handleAddConsumption = useCallback(() => {
    dispatch(addConsumptionAction({ drinkId: drink.id }));
  }, [dispatch, drink.id]);

  return (
    <View className='flex py-3'>
      <DrinkHeader drink={drink} onRemove={handleRemove} />
      <View className='flex-row justify-around py-2'>
        <Text className='flex-1 text-center'>Count</Text>
        <Text className='flex-[2] text-center'>Volume in ml</Text>
        <Text className='flex-[2] text-center'>Start Time</Text>
        <Text className='flex-[2] text-center'>End Time</Text>
      </View>
      <View>
        {drink.consumptions.map((consumption, index) => (
          <ConsumptionItem
            key={consumption.id}
            drinkId={drink.id}
            drinkDefaultVolume={drink.defaultVolume}
            consumption={consumption}
            index={index}
          />
        ))}
      </View>
      <Button variant='tonal' className='mx-3 mt-2' onPress={handleAddConsumption}>
        <Ionicons name='add-sharp' className='android:text-foreground text-xl text-primary' />
        <Text>Add {drink.name}</Text>
      </Button>
    </View>
  );
});
