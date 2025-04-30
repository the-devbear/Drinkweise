import { AddDrinkListItem } from '@drinkweise/components/session/add/AddDrinkListItem';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { useSearchDrinksQuery } from '@drinkweise/lib/drink-session/query/use-search-drinks-query';
import { useDebounce } from '@drinkweise/lib/utils/hooks/use-debounce';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useState } from 'react';
import { View } from 'react-native';

export default function AddDrinkPage() {
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search);

  const { drinks } = useSearchDrinksQuery(search, debounceSearch);

  return (
    <View className='flex-1'>
      <TextInput
        autoFocus
        clearButtonMode='while-editing'
        value={search}
        className='bg-card px-4 py-2'
        leftIcon={<Ionicons name='search' className='text-2xl leading-none text-foreground' />}
        variant='card'
        placeholder='Search...'
        onChangeText={setSearch}
      />
      <FlashList
        data={drinks}
        keyExtractor={(item) => item.id}
        estimatedItemSize={84}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => <AddDrinkListItem drink={item} />}
      />
    </View>
  );
}
