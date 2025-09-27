import { ProfileHeader } from '@drinkweise/components/profile/ProfileHeader';
import { SessionListItem } from '@drinkweise/components/session/SessionListItem';
import { useInfiniteSessionsQuery } from '@drinkweise/lib/sessions/query/use-infinite-sessions-query';
import { useSessionCountQuery } from '@drinkweise/lib/sessions/query/use-session-count-query';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import { userSelector } from '@drinkweise/store/user';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { Button } from '@drinkweise/ui/Button';
import { ErrorDisplay } from '@drinkweise/ui/ErrorDisplay';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from '@roninoss/icons';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Share, TouchableOpacity, View } from 'react-native';

export default function ProfilePage() {
  const user = useAppSelector(userSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { colors } = useColorScheme();

  const {
    data,
    isLoading,
    isError,
    errorUpdateCount,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    refetch: refetchSessions,
    isFetchNextPageError,
  } = useInfiniteSessionsQuery();

  const { data: sessionCount, refetch: refetchSessionCount } = useSessionCountQuery();

  const renderListEmpty = useCallback(() => {
    if (isError) {
      return (
        <ErrorDisplay
          message={error.message}
          isRetrying={isFetchingNextPage}
          onRetry={() => {
            refetchSessions();
            refetchSessionCount();
          }}
          canRetry={errorUpdateCount < 2}
        />
      );
    }

    if (isLoading) {
      return (
        <View className='flex-1 items-center justify-center py-10'>
          <ActivityIndicator size='large' />
        </View>
      );
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
        <Text variant='caption2' className='mt-5 text-center text-muted'>
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
    refetchSessions,
    refetchSessionCount,
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
            refetchSessions();
            refetchSessionCount();
          }}
          canRetry={errorUpdateCount < 2}
        />
      );
    }

    const hasLoadedSessions = (data?.pages.flat().length ?? 0) > 0;
    if (!hasNextPage && !!data && hasLoadedSessions) {
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
    refetchSessions,
    refetchSessionCount,
  ]);

  if (!user) {
    return (
      <View className='flex-1 p-6 pt-12'>
        <Text variant='title3' className='text-center font-semibold'>
          Unable to load profile
        </Text>
        <Text className='mt-2 text-center text-sm text-muted'>
          Please try signing in again or contact support if the issue persists.
        </Text>
        <Button variant='destructive' className='mt-4' onPress={() => dispatch(signOutAction())}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: user.username ?? 'Profile',
          headerTitleStyle: { fontSize: 20 },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.navigate('/profile/settings/profile')}>
              <Text className='text-sm font-medium'>Edit Profile</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View className='flex-row items-center gap-6'>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await Share.share({
                      // TODO: This URL is going to be changed when we deploy the app
                      url: 'https://sipcious.vercel.app/',
                    });
                  } catch (error) {
                    console.error('Error sharing:', error);
                  }
                }}>
                <Ionicons name='share-outline' className='text-2xl leading-none text-foreground' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  router.navigate('/profile/settings');
                }}>
                <Ionicons
                  name='settings-outline'
                  className='text-2xl leading-none text-foreground'
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <FlashList
        className='flex-1 pb-16'
        data={data?.pages.flat() ?? []}
        refreshing={isLoading}
        onRefresh={() => {
          refetchSessions();
          refetchSessionCount();
        }}
        ListHeaderComponent={
          <View>
            <ProfileHeader
              username={user.username}
              profilePicture={user.profilePicture}
              sessionCount={sessionCount ?? 0}
              weight={user.weight}
              height={user.height}
            />
            <View className='px-4 pt-2'>
              <Text variant='title3' className='mb-4 font-semibold'>
                Sessions
              </Text>
            </View>
          </View>
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item: session }) => (
          <SessionListItem
            className='px-4'
            id={session.id}
            name={session.name}
            userName={session.userName}
            startTime={new Date(session.startTime)}
            endTime={new Date(session.endTime)}
            note={session.note}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderListFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchNextPageError && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </>
  );
}
