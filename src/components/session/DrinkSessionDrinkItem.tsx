import { Avatar } from '@drinkweise/components/ui/Avatar';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { useAppDispatch } from '@drinkweise/store';
import { addConsumptionAction, removeDrinkAction } from '@drinkweise/store/drink-session';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Alert } from 'react-native';

import { ConsumptionItem } from './ConsumptionItem';
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
      <Button
        variant='tonal'
        className='mx-3'
        onPress={() => dispatch(addConsumptionAction({ drinkId: drink.id }))}>
        <Ionicons name='add-sharp' className='android:text-foreground text-xl text-primary' />
        <Text>Add {drink.name}</Text>
      </Button>
    </View>
  );
}
