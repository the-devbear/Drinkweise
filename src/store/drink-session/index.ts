import { createSlice } from '@reduxjs/toolkit';

import { drinkSessionSlice } from './drink-session.slice';
import { DrinkSessionState, initialDrinkSessionState } from './models/drink-session-state.model';

export const drinkSessionStateSlice = createSlice({
  name: drinkSessionSlice,
  initialState: initialDrinkSessionState,
  reducers: {
    startDrinkSession: (): DrinkSessionState => ({ status: 'active' }),
    cancelDrinkSession: (): DrinkSessionState => ({ status: 'inactive' }),
  },
  selectors: {
    isDrinkSessionActiveSelector: (state: DrinkSessionState): boolean => state.status === 'active',
  },
});

export const {
  startDrinkSession: startDrinkSessionAction,
  cancelDrinkSession: cancelDrinkSessionAction,
} = drinkSessionStateSlice.actions;
export const { isDrinkSessionActiveSelector } = drinkSessionStateSlice.selectors;
