import { AddDrinkListItem } from '@drinkweise/components/session/add/AddDrinkListItem';
import { ActivityIndicator } from '@drinkweise/components/ui/ActivityIndicator';
import { Button } from '@drinkweise/components/ui/Button';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { useSearchDrinksQuery } from '@drinkweise/lib/drink-session/query/use-search-drinks-query';
import { useDebounce } from '@drinkweise/lib/utils/hooks/use-debounce';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

export default function AddDrinkPage() {
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search);

  const { drinks, infiniteDrinksQuery, searchQuery, isSearchQueryActive } = useSearchDrinksQuery(
    search,
    debounceSearch
  );

  const onRefresh = useCallback(() => {
    if (search.length === 0) {
      infiniteDrinksQuery.refetch();
      return;
    }
    if (search.length > 0 && isSearchQueryActive) {
      searchQuery.refetch();
    }
  }, [search, isSearchQueryActive, infiniteDrinksQuery, searchQuery]);

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
        onChangeText={(value) => {
          setSearch(value.trim());
        }}
      />
      <FlashList
        data={drinks}
        keyExtractor={(item) => item.id}
        estimatedItemSize={84}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        contentContainerStyle={{ paddingBottom: 50 }}
        onRefresh={onRefresh}
        refreshing={infiniteDrinksQuery.isRefetching || searchQuery.isRefetching}
        renderItem={({ item }) => <AddDrinkListItem drink={item} />}
        ListHeaderComponent={() => {
          if (searchQuery.isError && search.length > 0) {
            return (
              <View className='items-center justify-center py-3'>
                <Ionicons name='sad-outline' className='text-5xl text-muted' />
                <Text variant='title3' className='mt-2 text-center font-semibold'>
                  Something went wrong
                </Text>
                <Text variant='subhead' color='tertiary' className='mt-1 text-center'>
                  {searchQuery.error.message}
                </Text>
              </View>
            );
          }
          return null;
        }}
        ListFooterComponent={() => {
          if (infiniteDrinksQuery.isError && search.length === 0) {
            return (
              <View className='flex-1 items-center justify-center py-10'>
                <Ionicons name='sad-outline' className='text-5xl text-muted' />
                <Text variant='title3' className='mt-2 text-center font-semibold'>
                  Something went wrong
                </Text>
                <Text variant='subhead' color='tertiary' className='mt-1 text-center'>
                  {infiniteDrinksQuery.error.message}
                </Text>
                {infiniteDrinksQuery.errorUpdateCount < 2 ? (
                  <Button
                    loading={infiniteDrinksQuery.isFetchingNextPage}
                    onPress={() => {
                      infiniteDrinksQuery.fetchNextPage();
                    }}
                    className='mt-4'
                    variant='primary'>
                    <Text>Try again</Text>
                  </Button>
                ) : (
                  <Text variant='subhead' color='tertiary' className='mt-1 text-center'>
                    Please try again later
                  </Text>
                )}
              </View>
            );
          }
          if (infiniteDrinksQuery.isFetchingNextPage) {
            return <ActivityIndicator className='py-4' />;
          }

          if (!infiniteDrinksQuery.hasNextPage && drinks.length > 0) {
            return (
              <View className='py-4'>
                <Text variant='footnote' className='text-center text-muted'>
                  No more drinks to load
                </Text>
              </View>
            );
          }
          return null;
        }}
        ListEmptyComponent={() => {
          if (infiniteDrinksQuery.isError || searchQuery.isError) {
            return null;
          }

          if (infiniteDrinksQuery.isFetching) {
            // TODO: Maybe add a skeleton here
            return <ActivityIndicator size='large' className='py-4' />;
          }

          if ((isSearchQueryActive && searchQuery.isLoading) || search !== debounceSearch) {
            return <ActivityIndicator size='large' className='py-4' />;
          }

          return (
            <View className='flex-1 items-center justify-center py-10'>
              <Ionicons name='beer-outline' className='text-5xl text-muted' />
              <Text variant='title3' className='mt-2 text-center font-semibold'>
                No drinks found
              </Text>
              <Text variant='subhead' color='tertiary' className='mt-1 text-center'>
                {search.length > 0
                  ? 'Try a different search term'
                  : "Sorry we couldn't find any drinks"}
              </Text>
            </View>
          );
        }}
        onEndReached={() => {
          if (search.length === 0 && !infiniteDrinksQuery.isError) {
            infiniteDrinksQuery.fetchNextPage();
          }
        }}
      />
    </View>
  );
}
