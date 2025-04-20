import { drinkSessionService } from '@drinkweise/api/drink-session';
import type { CompleteDrinkSessionRequestModel } from '@drinkweise/api/drink-session/models/complete-drink-session-request.model';
import type { SerializedPostgrestError } from '@drinkweise/lib/types/redux/errors';
import { now } from '@drinkweise/lib/utils/date/now';
import { serializePostgrestError } from '@drinkweise/lib/utils/redux/serialize-errors';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { drinkSessionSlice } from '../drink-session.slice';
import type { ActiveDrinkSessionModel } from '../models/drink-session-state.model';

export const completeDrinkSessionAction = createAsyncThunk<
  void,
  { session: ActiveDrinkSessionModel },
  { rejectValue: SerializedPostgrestError }
>(`${drinkSessionSlice}/completeDrinkSession`, async ({ session }, { rejectWithValue }) => {
  const completedSession: CompleteDrinkSessionRequestModel = {
    name: session.name,
    note: session.note,
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
});
