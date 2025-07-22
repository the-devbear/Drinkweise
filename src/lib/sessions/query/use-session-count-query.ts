import { drinkSessionService } from '@drinkweise/api/drink-session';
import { SESSIONS_QUERY_KEY } from '@drinkweise/lib/utils/query/keys';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useQuery } from '@tanstack/react-query';

interface UseSessionCountQueryOptions {
  userId?: string;
}

export function useSessionCountQuery(options?: UseSessionCountQueryOptions) {
  const currentUserId = useAppSelector(userIdSelector);
  const userId = options?.userId ?? currentUserId;

  return useQuery({
    queryKey: [SESSIONS_QUERY_KEY, userId, 'count'],
    queryFn: async () => {
      const { value, error } = await drinkSessionService.getSessionCountByUserId(userId!);

      if (error) {
        throw error;
      }

      return value;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}
