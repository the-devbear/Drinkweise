import { useFeatureRequestsQuery } from '@drinkweise/lib/feature-requests';
import { useHeaderSearchBar } from '@drinkweise/lib/useHeaderSearchBar';
import { ActivityIndicator } from '@drinkweise/ui/ActivityIndicator';
import { Button } from '@drinkweise/ui/Button';
import { ErrorDisplay } from '@drinkweise/ui/ErrorDisplay';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { RefreshControl, View } from 'react-native';

import { FeatureRequestItem } from './FeatureRequestItem';

export function FeatureRequestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useFeatureRequestsQuery(searchQuery);

  useHeaderSearchBar({
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    placeholder: 'Search feature requests...',
  });

  const allFeatureRequests = data?.pages.flatMap((page) => page.data) ?? [];

  const handleCreateFeatureRequest = () => {
    router.push('/profile/settings/feature-requests/create');
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => <FeatureRequestItem featureRequest={item} />,
    []
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className='py-4'>
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (isLoading) {
      return null;
    }

    return (
      <View className='flex-1 items-center justify-center px-6 py-12'>
        <Ionicons name='bulb-outline' size={64} className='mb-4 text-muted-foreground' />
        <Text variant='title2' className='mb-2 text-center font-semibold'>
          {searchQuery ? 'No Results Found' : 'No Feature Requests Yet'}
        </Text>
        <Text variant='body' className='mb-6 text-center text-muted-foreground'>
          {searchQuery
            ? 'Try adjusting your search terms or be the first to request this feature.'
            : 'Be the first to suggest a feature that would make Drinkweise even better!'}
        </Text>
        <Button variant='primary' size='lg' onPress={handleCreateFeatureRequest}>
          <Ionicons name='add-outline' size={20} className='text-white' />
          <Text className='text-white'>Request Feature</Text>
        </Button>
      </View>
    );
  };

  if (isError) {
    return (
      <View className='flex-1 px-6 py-6'>
        <ErrorDisplay
          title='Failed to Load Feature Requests'
          message={error?.message || 'Something went wrong while loading feature requests.'}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View className='flex-1'>
      {/* Search Bar - Mobile Only */}
      <View className='px-6 py-3 web:hidden'>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder='Search feature requests...'
          variant='card'
        />
      </View>

      {/* Feature Requests List */}
      <FlashList
        data={allFeatureRequests}
        renderItem={renderItem}
        estimatedItemSize={150}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentInsetAdjustmentBehavior='automatic'
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      {allFeatureRequests.length > 0 && (
        <View className='absolute bottom-6 right-6'>
          <Button
            variant='primary'
            size='icon'
            onPress={handleCreateFeatureRequest}
            className='h-14 w-14 rounded-full shadow-lg'>
            <Ionicons name='add-outline' size={24} className='text-white' />
          </Button>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View className='absolute inset-0 items-center justify-center bg-background/80'>
          <ActivityIndicator size='large' />
        </View>
      )}
    </View>
  );
}