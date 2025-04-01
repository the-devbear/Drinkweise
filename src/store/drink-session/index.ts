import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { drinkSessionSlice } from './drink-session.slice';
import { AddDrinkModel } from './models/add-drink.model';
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
        drinks: [],
      }) satisfies DrinkSessionState,
    cancelDrinkSession: () => initialDrinkSessionState,
    addDrink: (state, { payload: { drink } }: PayloadAction<{ drink: AddDrinkModel }>) => {
      if (state.status !== 'active') {
        return;
      }

      const hasAlreadyBeenAdded =
        state.drinks.findIndex((currentDrink) => currentDrink.id === drink.id) !== -1;

      if (hasAlreadyBeenAdded) {
        return;
      }

      state.drinks.push({
        id: drink.id,
        name: drink.name,
        type: drink.type,
        alcohol: drink.alcohol,
        defaultVolume: drink.defaultVolume,
        consumptions: [
          {
            id: 1,
            volume: drink.defaultVolume,
            startTime: Date.now(),
          },
        ],
      });
    },
    removeDrink: (state, { payload: { drinkId } }: PayloadAction<{ drinkId: string }>) => {
      if (state.status !== 'active') {
        return;
      }

      const drinkIndex = state.drinks.findIndex((drink) => drink.id === drinkId);

      if (drinkIndex === -1) {
        return;
      }

      state.drinks.splice(drinkIndex, 1);
    },
  },
  selectors: {
    isDrinkSessionActiveSelector: (state: DrinkSessionState): boolean => state.status === 'active',
    drinksSelector: (state: DrinkSessionState) =>
      state.status === 'active' ? state.drinks : undefined,
  },
});

export const {
  startDrinkSession: startDrinkSessionAction,
  cancelDrinkSession: cancelDrinkSessionAction,
  addDrink: addDrinkAction,
  removeDrink: removeDrinkAction,
} = drinkSessionStateSlice.actions;
export const { isDrinkSessionActiveSelector, drinksSelector } = drinkSessionStateSlice.selectors;
