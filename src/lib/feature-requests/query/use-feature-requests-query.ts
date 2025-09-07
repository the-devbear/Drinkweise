import { FeatureRequestsService } from '@drinkweise/api/feature-requests';
import { supabase } from '@drinkweise/lib/supabase';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const STALE_TIME = 300_000; // 5 minutes
const FEATURE_REQUESTS_QUERY_KEY = 'feature-requests';

const featureRequestsService = new FeatureRequestsService(supabase);

export function useFeatureRequestsQuery(searchQuery?: string) {
  const userId = useAppSelector(userIdSelector);
  const queryClient = useQueryClient();

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

  // Set up real-time subscriptions
  useEffect(() => {
    const featureRequestsChannel = supabase
      .channel('feature-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_requests',
        },
        (payload) => {
          console.log('Feature request change detected:', payload);
          // Invalidate and refetch the query when any change occurs
          queryClient.invalidateQueries({ queryKey: [FEATURE_REQUESTS_QUERY_KEY] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_request_upvotes',
        },
        (payload) => {
          console.log('Feature request upvote change detected:', payload);
          // Invalidate and refetch the query when upvotes change
          queryClient.invalidateQueries({ queryKey: [FEATURE_REQUESTS_QUERY_KEY] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(featureRequestsChannel);
    };
  }, [queryClient]);

  return query;
}