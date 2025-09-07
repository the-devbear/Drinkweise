import { FeatureRequestsService } from '@drinkweise/api/feature-requests';
import { supabase } from '@drinkweise/lib/supabase';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const FEATURE_REQUESTS_QUERY_KEY = 'feature-requests';

const featureRequestsService = new FeatureRequestsService(supabase);

export function useDeleteFeatureRequestMutation() {
  const userId = useAppSelector(userIdSelector);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (featureRequestId: string) => {
      if (!userId) {
        throw new Error('User must be authenticated');
      }

      const result = await featureRequestsService.deleteFeatureRequest(featureRequestId, userId);

      if (result?.error) {
        throw new Error(result.error.message);
      }

      return featureRequestId;
    },
    onSuccess: () => {
      // Invalidate and refetch feature requests queries
      queryClient.invalidateQueries({ queryKey: [FEATURE_REQUESTS_QUERY_KEY] });
    },
  });
}