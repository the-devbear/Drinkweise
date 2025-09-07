import { FeatureRequestsService } from '@drinkweise/api/feature-requests';
import { supabase } from '@drinkweise/lib/supabase';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useFeatureRequestsRealtime } from './use-feature-requests-realtime';

const STALE_TIME = 300_000; // 5 minutes
const FEATURE_REQUESTS_QUERY_KEY = 'feature-requests';

const featureRequestsService = new FeatureRequestsService(supabase);

export function useFeatureRequestsQuery(searchQuery?: string) {
  const userId = useAppSelector(userIdSelector);
  
  // Set up real-time subscriptions
  useFeatureRequestsRealtime();

  const query = useInfiniteQuery({
    queryKey: [FEATURE_REQUESTS_QUERY_KEY, searchQuery || ''],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const result = await featureRequestsService.getFeatureRequests(
        userId || undefined,
        searchQuery,
        pageParam,
        20
      );

      if ('error' in result) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    staleTime: STALE_TIME,
  });

  return query;
}