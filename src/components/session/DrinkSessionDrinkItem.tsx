import { Text } from '@drinkweise/components/ui/Text';
import { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';
import { View } from 'react-native';

interface DrinkSessionDrinkItemProps {
  drink: DrinkModel;
}

export function DrinkSessionDrinkItem({ drink }: DrinkSessionDrinkItemProps) {
  return (
    <View>
      <View className='flex-row justify-between'>
        <Text>{drink.name}</Text>
        <Text>{drink.alcohol}</Text>
        <Text>{drink.defaultVolume}</Text>
      </View>
      {drink.consumptions.map((consumption) => (
        <View key={consumption.id} className='flex-row justify-between'>
          <Text>{consumption.volume}</Text>
          <Text>{new Date(consumption.startTime).toLocaleString('de-DE')}</Text>
        </View>
      ))}
    </View>
  );
}
