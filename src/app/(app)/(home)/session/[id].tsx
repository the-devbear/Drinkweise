import { SessionHeader } from '@drinkweise/components/session/SessionHeader';
import { SessionSummaryCard } from '@drinkweise/components/session/SessionSummaryCard';
import { SessionTimelineCard } from '@drinkweise/components/session/SessionTimelineCard';
import { ErrorDisplay } from '@drinkweise/components/ui/ErrorDisplay';
import { useSessionByIdQuery } from '@drinkweise/lib/sessions/query/use-session-by-id-query';
import { ActivityIndicator } from '@drinkweise/ui/ActivityIndicator';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';

export default function SessionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: session,
    error,
    isLoading,
    isError,
    isFetching,
    refetch,
    errorUpdateCount,
  } = useSessionByIdQuery(id);

  if (isLoading) {
    return <ActivityIndicator size='large' className='pt-8' />;
  }

  if (isError || !session) {
    return (
      <ErrorDisplay
        message={error?.message ?? 'Sorry there was an error loading the session.'}
        isRetrying={isFetching}
        onRetry={refetch}
        canRetry={errorUpdateCount < 3}
      />
    );
  }

  const sessionStartTime = new Date(session.startTime);
  const sessionEndTime = new Date(session.endTime);

  return (
    <ScrollView className='flex-col gap-4' contentContainerClassName='gap-3 pb-20'>
      <SessionHeader
        name={session.name}
        note={session.note}
        userName={session.user.userName}
        startTime={sessionStartTime}
        userProfilePictureUrl={session.user.profilePictureUrl}
        onUserProfilePress={() => {}}
      />

      <SessionSummaryCard
        sessionStartTime={sessionStartTime}
        sessionEndTime={sessionEndTime}
        consumptions={session.consumptions}
      />

      <SessionTimelineCard sessionConsumptions={session.consumptions} />
    </ScrollView>
  );
}
