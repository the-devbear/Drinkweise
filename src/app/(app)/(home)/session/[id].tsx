import { SessionHeader } from '@drinkweise/components/session/SessionHeader';
import { SessionSummaryCard } from '@drinkweise/components/session/SessionSummaryCard';
import { useSessionByIdQuery } from '@drinkweise/lib/sessions/query/use-session-by-id-query';
import { ActivityIndicator } from '@drinkweise/ui/ActivityIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@drinkweise/ui/Card';
import { Text } from '@drinkweise/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function SessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: session, error, isLoading, isError } = useSessionByIdQuery(id);

  if (isLoading) {
    return <ActivityIndicator size='large' className='pt-8' />;
  }

  if (isError || !session) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='text-lg font-semibold text-gray-900 dark:text-white'>
          {error?.message ?? 'Sorry there was an mistake'}
        </Text>
      </View>
    );
  }

  const timelineData = Object.entries(
    session.consumptions.reduce(
      (acc, drink) => {
        // TODO: probably check if hours and minute are the same
        if (!acc[drink.startTime]) {
          acc[drink.startTime] = [];
        }
        acc[drink.startTime]?.push(drink);
        return acc;
      },

      {} as Record<
        string,
        NonNullable<ReturnType<typeof useSessionByIdQuery>['data']>['consumptions']
      >
    )
  ).map(([time, value]) => ({ time, drinks: value }));

  return (
    <ScrollView className='flex-col gap-4' contentContainerClassName='gap-3 pb-20'>
      <SessionHeader
        name={session.name}
        note={session.note}
        userName={session.user.userName}
        startTime={new Date(session.startTime)}
        userProfilePictureUrl={session.user.profilePictureUrl}
        onUserProfilePress={() => {}}
      />

      <SessionSummaryCard
        sessionStartTime={new Date(session.startTime)}
        sessionEndTime={new Date(session.endTime)}
        consumptions={session.consumptions}
      />

      <Card className='mx-4'>
        <CardHeader>
          <CardTitle className='font-bold text-gray-600 dark:text-gray-300'>
            Consumption Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.map((timePoint) => (
            // TODO: extract to component
            <View key={timePoint.time} className='mb-0'>
              <View className='ml-2 border-l-2 border-blue-200/60 pl-4 dark:border-blue-500/30'>
                <View className='mb-1 flex-row'>
                  <View className='absolute -left-6 h-4 w-4 rounded-full bg-blue-500 dark:bg-blue-500' />
                  <Text className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
                    {new Date(timePoint.time).toLocaleTimeString('default', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {timePoint.drinks.map((consumption) => (
                  <View
                    key={consumption.id}
                    className='mb-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                    <View className=' flex-row items-center justify-between'>
                      <View className='flex-1 flex-row items-center'>
                        {/* TODO: Icons for all types  */}
                        <Ionicons
                          name={consumption.type === 'beer' ? 'beer-outline' : 'wine-outline'}
                          className='mr-2 text-[28px] text-amber-500 dark:text-amber-400'
                        />
                        <View className='flex-1'>
                          <Text className='font-medium text-gray-900 dark:text-white'>
                            {consumption.name}
                          </Text>
                          <Text className='text-xs text-gray-500 dark:text-gray-400'>
                            {consumption.volume} ml
                          </Text>
                        </View>
                      </View>
                      <Text className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        {consumption.alcohol} %
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
