import { drinkSessionService } from '@drinkweise/api/drink-session';
import { delay } from '@drinkweise/lib/utils/delay';
import { SESSION_QUERY_KEY } from '@drinkweise/lib/utils/query/keys';
import { useQuery } from '@tanstack/react-query';

export function useSessionByIdQuery(sessionId: string) {
  return useQuery({
    queryKey: [SESSION_QUERY_KEY, sessionId],
    queryFn: async ({ signal }) => {
      await delay(2);
      const { value, error } = await drinkSessionService.getDrinkSessionById(sessionId, signal);

      if (error) {
        throw error;
      }

      return value;
    },
  });
}
