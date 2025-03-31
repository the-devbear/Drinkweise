import { createSlice } from '@reduxjs/toolkit';

import { drinkSessionSlice } from './drink-session.slice';
import {
  type DrinkSessionState,
  initialDrinkSessionState,
} from './models/drink-session-state.model';

export const drinkSessionStateSlice = createSlice({
  name: drinkSessionSlice,
  initialState: initialDrinkSessionState,
  reducers: {
    startDrinkSession: () =>
      ({
        status: 'active',
        name: '',
        startTime: Date.now(),
        drinks: {},
      }) satisfies DrinkSessionState,
    cancelDrinkSession: () => initialDrinkSessionState,
  },
  selectors: {
    isDrinkSessionActiveSelector: (state: DrinkSessionState): boolean => state.status === 'active',
    drinksSelector: (state: DrinkSessionState) =>
      state.status === 'active' ? Object.values(state.drinks) : undefined,
  },
});

export const {
  startDrinkSession: startDrinkSessionAction,
  cancelDrinkSession: cancelDrinkSessionAction,
} = drinkSessionStateSlice.actions;
export const { isDrinkSessionActiveSelector, drinksSelector } = drinkSessionStateSlice.selectors;
