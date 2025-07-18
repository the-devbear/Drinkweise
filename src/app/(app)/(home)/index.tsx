import { SessionListItem } from '@drinkweise/components/session/SessionListItem';
import { ErrorDisplay } from '@drinkweise/components/ui/ErrorDisplay';
import { Text } from '@drinkweise/components/ui/Text';
import { useInfiniteSessionsQuery } from '@drinkweise/lib/sessions/query/use-infinite-sessions-query';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { ActivityIndicator } from '@drinkweise/ui/ActivityIndicator';
import { Button } from '@drinkweise/ui/Button';
import { Icon } from '@roninoss/icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

export default function HomePage() {
  const { colors } = useColorScheme();
  const router = useRouter();
  const {
    data,
    refetch,
    isRefetching,
    isLoading,
    errorUpdateCount,
    hasNextPage,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    error,
    isFetchNextPageError,
  } = useInfiniteSessionsQuery();

  const renderListHeader = useCallback(() => {
    if (isLoading) {
      return (
        <View className='items-center justify-center py-3'>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return null;
  }, [isLoading]);

  const renderListEmpty = useCallback(() => {
    if (isError) {
      return (
        <ErrorDisplay
          message={error.message}
          isRetrying={isFetchingNextPage}
          onRetry={() => {
            refetch();
          }}
          canRetry={errorUpdateCount < 2}
        />
      );
    }

    if (isLoading) {
      return null;
    }

    return (
      <View className='flex-1 items-center justify-center py-10'>
        <Icon name='chart-timeline-variant' size={48} color={colors.primary} />
        <Text variant='title3' className='my-2 text-center font-semibold'>
          No drink sessions yet
        </Text>
        <Text className='text-center'>Start tracking your drinks by creating a new session.</Text>
        <Button
          variant='primary'
          className='mt-4'
          onPress={() => {
            router.navigate('/(app)/drinks');
          }}>
          <Text>Create Session</Text>
        </Button>
        <Text variant='caption2' className='mt-2 text-center text-muted'>
          Tracking your alcohol consumption is for informational purposes only. Please drink
          responsibly.
        </Text>
      </View>
    );
  }, [
    colors.primary,
    error?.message,
    errorUpdateCount,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
    router,
  ]);

  const renderListFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return <ActivityIndicator className='py-4' />;
    }
    if (isFetchNextPageError) {
      return (
        <ErrorDisplay
          message={error.message}
          isRetrying={isFetchingNextPage}
          onRetry={() => {
            refetch();
          }}
          canRetry={errorUpdateCount < 2}
        />
      );
    }
    if (!hasNextPage && !!data && data?.pageParams.length > 1) {
      return (
        <Text variant='footnote' className='py-4 text-center text-muted'>
          No more sessions to load
        </Text>
      );
    }
    return null;
  }, [
    data,
    error?.message,
    errorUpdateCount,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
    refetch,
  ]);

  return (
    <View className='flex-1 px-4'>
      <FlashList
        data={data?.pages.flat() ?? []}
        className='py-4'
        estimatedItemSize={200}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={({ item }) => (
          <SessionListItem
            id={item.id}
            name={item.name}
            userName={item.userName}
            startTime={new Date(item.startTime)}
            endTime={new Date(item.endTime)}
            note={item.note}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchNextPageError && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </View>
  );
}
