import { drinkSessionService } from '@drinkweise/api/drink-session';
import type { CompleteDrinkSessionRequestModel } from '@drinkweise/api/drink-session/models/complete-drink-session-request.model';
import type { SerializedPostgrestError } from '@drinkweise/lib/types/redux/errors';
import { now } from '@drinkweise/lib/utils/date/now';
import { SESSIONS_QUERY_KEY } from '@drinkweise/lib/utils/query/keys';
import { queryClient } from '@drinkweise/lib/utils/query/query-client';
import { serializePostgrestError } from '@drinkweise/lib/utils/redux/serialize-errors';
import type { RootState } from '@drinkweise/store';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { drinkSessionSlice } from '../drink-session.slice';

export const completeDrinkSessionAction = createAsyncThunk<
  void,
  { name: string; note?: string },
  { rejectValue: SerializedPostgrestError | { message: string }; state: RootState }
>(
  `${drinkSessionSlice}/completeDrinkSession`,
  async ({ name, note }, { rejectWithValue, getState }) => {
    const session = getState().drinkSession;

    if (session.status !== 'active') {
      return rejectWithValue({
        message: 'Drink session is not active',
      });
    }

    const completedSession: CompleteDrinkSessionRequestModel = {
      name,
      note,
      startTime: new Date(session.startTime),
      endTime: new Date(now()),
      consumptions: session.drinks.flatMap((drink) =>
        drink.consumptions.map((consumption) => ({
          drinkId: drink.id,
          volume: consumption.volume,
          startTime: new Date(consumption.startTime),
          endTime: new Date(consumption.endTime ?? now()),
        }))
      ),
    };

    const { error } = await drinkSessionService.completeDrinkSession(completedSession);

    if (error) {
      return rejectWithValue(serializePostgrestError(error));
    }

    queryClient.invalidateQueries({
      queryKey: [SESSIONS_QUERY_KEY],
    });
  }
);
