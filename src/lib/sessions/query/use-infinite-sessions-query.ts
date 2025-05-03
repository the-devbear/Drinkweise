import { supabase } from '@drinkweise/lib/supabase';
import { delay } from '@drinkweise/lib/utils/delay';
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
      let query = supabase
        .from('drink_sessions')
        .select('id, user_id, name, note, start_time, end_time, users(username)')
        .eq('user_id', userId!)
        .order('start_time', { ascending: false })
        .limit(5);

      if (pageParam) {
        query = query.lt('start_time', pageParam);
      }

      await delay(3);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data) {
        return [];
      }

      const sessions = data.map((session) => ({
        id: session.id,
        name: session.name,
        note: session.note,
        startTime: session.start_time,
        endTime: session.end_time,
        userName: session.users.username,
      }));

      return sessions;
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
