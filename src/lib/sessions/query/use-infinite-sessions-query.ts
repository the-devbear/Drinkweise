import { drinkSessionService } from '@drinkweise/api/drink-session';
import { SESSIONS_QUERY_KEY } from '@drinkweise/lib/utils/query/keys';
import { useAppSelector } from '@drinkweise/store';
import { userIdSelector } from '@drinkweise/store/user';
import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteSessionsQuery() {
  const userId = useAppSelector(userIdSelector);

  return useInfiniteQuery({
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
      if (lastPage.length === 0 || lastPage.length < drinkSessionService.DEFAULT_PAGE_SIZE) {
        return undefined;
      }
      return lastPage[lastPage.length - 1]!.startTime;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}
