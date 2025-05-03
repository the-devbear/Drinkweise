import { drinkSessionService } from '@drinkweise/api/drink-session';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useInfiniteQuery } from '@tanstack/react-query';

export const SESSIONS_QUERY_KEY = 'sessions' as const;

export function useInfiniteSessionsQuery() {
  const userId = useAppSelector(userIdSelector);

  const infiniteSessionQuery = useInfiniteQuery({
    queryKey: [SESSIONS_QUERY_KEY, userId],
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const { value, error } = await drinkSessionService.getPaginatedDrinkSessionsByUserId(
        userId!,
        pageParam
      );

      if (error) {
        throw error;
      }

      if (!value) {
        return [];
      }

      return value;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPage[lastPage.length - 1]!.startTime;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  return infiniteSessionQuery;
}
