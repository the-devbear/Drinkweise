import { SessionHeader } from '@drinkweise/components/session/SessionHeader';
import { SessionSummaryCard } from '@drinkweise/components/session/SessionSummaryCard';
import { SessionTimelineCard } from '@drinkweise/components/session/SessionTimelineCard';
import { BACLineChart } from '@drinkweise/components/shared/charts/bac/BACLineChart';
import { ErrorDisplay } from '@drinkweise/components/ui/ErrorDisplay';
import { generateDataPointsForBACGraph } from '@drinkweise/lib/bac/generate-data-points-for-bac-graph';
import { prepareConsumptionsForBACCalculation } from '@drinkweise/lib/bac/utils/prepare-consumptions-for-bac-calculation';
import { useSessionByIdQuery } from '@drinkweise/lib/sessions/query/use-session-by-id-query';
import { tryMapToEnum } from '@drinkweise/lib/utils/enum';
import { Genders } from '@drinkweise/store/user/enums/gender';
import { ActivityIndicator } from '@drinkweise/ui/ActivityIndicator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

export default function SessionDetailPage() {
  const router = useRouter();
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
  const bacDataPoints = generateDataPointsForBACGraph({
    startTime: sessionStartTime.getTime(),
    consumptions: prepareConsumptionsForBACCalculation(session.consumptions),
    height: session.user.height,
    weight: session.user.weight,
    gender: tryMapToEnum(Genders, session.user.gender),
    endTime: sessionEndTime.getTime(),
  });

  return (
    <ScrollView className='flex-col gap-4' contentContainerClassName='gap-3 pb-20'>
      <SessionHeader
        name={session.name}
        note={session.note}
        userName={session.user.userName}
        startTime={sessionStartTime}
        userProfilePictureUrl={session.user.profilePictureUrl}
        onUserProfilePress={() => {
          // TODO: We navigate to profile page for now since we don't have implemented followers yet
          router.navigate('/profile');
        }}
      />

      <BACLineChart bacDataPoints={bacDataPoints} />

      <SessionSummaryCard
        sessionStartTime={sessionStartTime}
        sessionEndTime={sessionEndTime}
        consumptions={session.consumptions}
      />

      <SessionTimelineCard sessionConsumptions={session.consumptions} />
    </ScrollView>
  );
}
