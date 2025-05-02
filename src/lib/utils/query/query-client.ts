import { QueryClient } from '@tanstack/react-query';

import { MAX_AGE_IN_MILLISECONDS } from './tanstack-query.config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: MAX_AGE_IN_MILLISECONDS,
    },
  },
});
