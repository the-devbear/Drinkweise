import { AddDrinkListItem } from '@drinkweise/components/drink-session/add/AddDrinkListItem';
import { AddDrinkSkeletonItem } from '@drinkweise/components/drink-session/add/AddDrinkSkeletonItem';
import { ErrorDisplay } from '@drinkweise/components/ui/ErrorDisplay';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { useSearchDrinksQuery } from '@drinkweise/lib/drink-session/query/use-search-drinks-query';
import { useDebounce } from '@drinkweise/lib/utils/hooks/use-debounce';
import { ActivityIndicator } from '@drinkweise/ui/ActivityIndicator';
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

  const renderListHeader = useCallback(() => {
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
  }, [search.length, searchQuery.error?.message, searchQuery.isError]);

  const renderListFooter = useCallback(() => {
    if (infiniteDrinksQuery.isError && search.length === 0) {
      return (
        <ErrorDisplay
          message={infiniteDrinksQuery.error.message}
          onRetry={() => {
            infiniteDrinksQuery.fetchNextPage();
          }}
          isRetrying={infiniteDrinksQuery.isFetchingNextPage}
          canRetry={infiniteDrinksQuery.errorUpdateCount < 2}
        />
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
  }, [drinks.length, infiniteDrinksQuery, search.length]);

  const renderListEmpty = useCallback(() => {
    if (infiniteDrinksQuery.isError || searchQuery.isError) {
      return null;
    }
    if (infiniteDrinksQuery.isFetching) {
      return Array.from({ length: 8 }, (_, index) => <AddDrinkSkeletonItem key={index} />);
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
          {search.length > 0 ? 'Try a different search term' : "Sorry we couldn't find any drinks"}
        </Text>
      </View>
    );
  }, [
    debounceSearch,
    infiniteDrinksQuery.isError,
    infiniteDrinksQuery.isFetching,
    isSearchQueryActive,
    search,
    searchQuery.isError,
    searchQuery.isLoading,
  ]);

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
        scrollEnabled={!infiniteDrinksQuery.isLoading}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderListEmpty}
        onEndReached={() => {
          if (
            search.length === 0 &&
            !infiniteDrinksQuery.isError &&
            infiniteDrinksQuery.hasNextPage &&
            !infiniteDrinksQuery.isFetchingNextPage
          ) {
            infiniteDrinksQuery.fetchNextPage();
          }
        }}
      />
    </View>
  );
}
