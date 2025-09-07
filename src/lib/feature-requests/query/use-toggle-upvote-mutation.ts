import { FeatureRequestsService } from '@drinkweise/api/feature-requests';
import { supabase } from '@drinkweise/lib/supabase';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const FEATURE_REQUESTS_QUERY_KEY = 'feature-requests';

const featureRequestsService = new FeatureRequestsService(supabase);

export function useToggleUpvoteMutation() {
  const userId = useAppSelector(userIdSelector);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (featureRequestId: string) => {
      if (!userId) {
        throw new Error('User must be authenticated');
      }

      const result = await featureRequestsService.toggleUpvote(featureRequestId, userId);

      if ('error' in result) {
        throw new Error(result.error.message);
      }

      return { featureRequestId, ...result.data };
    },
    onMutate: async (featureRequestId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [FEATURE_REQUESTS_QUERY_KEY] });

      // Snapshot the previous value
      const previousData = queryClient.getQueriesData({ queryKey: [FEATURE_REQUESTS_QUERY_KEY] });

      // Optimistically update the cache
      queryClient.setQueriesData({ queryKey: [FEATURE_REQUESTS_QUERY_KEY] }, (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((request: any) => {
              if (request.id === featureRequestId) {
                const wasUpvoted = request.user_has_upvoted;
                return {
                  ...request,
                  user_has_upvoted: !wasUpvoted,
                  upvotes_count: request.upvotes_count + (wasUpvoted ? -1 : 1),
                };
              }
              return request;
            }),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, featureRequestId, context) => {
      // Rollback the optimistic update
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [FEATURE_REQUESTS_QUERY_KEY] });
    },
  });
}