import { AddDrinkList } from '@drinkweise/components/session/add/AddDrinkList';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';
import { View } from 'react-native';

// This is a mock data for the drinks
const DATA: AddDrinkModel[] = [
  {
    id: '1',
    name: 'Heineken',
    alcohol: 5,
    defaultVolume: 330,
    type: 'beer',
  },
  {
    id: '6',
    name: 'Guinness',
    alcohol: 4.2,
    defaultVolume: 440,
    type: 'beer',
  },
  {
    id: '7',
    name: 'Corona',
    alcohol: 4.5,
    defaultVolume: 330,
    type: 'beer',
  },
  {
    id: '8',
    name: 'Budweiser',
    alcohol: 5,
    defaultVolume: 330,
    type: 'beer',
  },

  {
    id: '9',
    name: 'Jack Daniels',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '10',
    name: 'Jameson',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '11',
    name: 'Hennessy',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '12',
    name: 'Baileys',
    alcohol: 17,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '13',
    name: 'Captain Morgan',
    alcohol: 35,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '14',
    name: 'Malibu',
    alcohol: 21,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '15',
    name: 'Jagermeister',
    alcohol: 35,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '16',
    name: 'Patron',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '17',
    name: 'Tequila',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '18',
    name: 'Gin',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '19',
    name: 'Rum',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '20',
    name: 'Whiskey',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '21',
    name: 'Sambuca',
    alcohol: 38,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '22',
    name: 'Cognac',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '2',
    name: 'Vodka',
    alcohol: 40,
    defaultVolume: 50,
    type: 'spirit',
  },
  {
    id: '3',
    name: 'Bordeaux',
    alcohol: 12,
    defaultVolume: 150,
    type: 'red-wine',
  },
  {
    id: '4',
    name: 'Chardonnay',
    alcohol: 13,
    defaultVolume: 150,
    type: 'white-wine',
  },
  {
    id: '5',
    name: 'Coke',
    alcohol: 0,
    defaultVolume: 330,
    type: 'other',
  },
];

export default function AddDrinkPage() {
  return (
    <View className='flex-1'>
      <AddDrinkList data={DATA} />
    </View>
  );
}
