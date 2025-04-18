import { storage } from '@drinkweise/lib/storage/mmkv';
import { now } from '@drinkweise/lib/utils/date/now';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { drinkSessionSlice } from './drink-session.slice';
import { AddDrinkModel } from './models/add-drink.model';
import { DrinkConsumptionModel } from './models/consumption.model';
import {
  type DrinkSessionState,
  initialDrinkSessionState,
} from './models/drink-session-state.model';

function getInitialDrinkSessionState(): DrinkSessionState {
  const drinkSessionState = storage.getString(drinkSessionSlice);
  if (!drinkSessionState) {
    return initialDrinkSessionState;
  }

  try {
    // TODO: Check if the data is of the correct type
    return JSON.parse(drinkSessionState);
  } catch (e) {
    console.error(e);
  }
  return initialDrinkSessionState;
}

export const drinkSessionStateSlice = createSlice({
  name: drinkSessionSlice,
  initialState: getInitialDrinkSessionState(),
  reducers: {
    startDrinkSession: () =>
      ({
        status: 'active',
        name: '',
        startTime: now(),
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
            startTime: now(),
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
    addConsumption: (state, { payload: { drinkId } }: PayloadAction<{ drinkId: string }>) => {
      if (state.status !== 'active') {
        return;
      }

      const drink = state.drinks.find((currentDrink) => currentDrink.id === drinkId);

      if (!drink) {
        return;
      }

      const lastConsumption = drink.consumptions.at(-1);

      drink.consumptions.push({
        id: lastConsumption ? lastConsumption.id + 1 : 1,
        volume: lastConsumption?.volume ?? drink.defaultVolume,
        startTime: now(),
      });
    },
    removeConsumption: (
      state,
      {
        payload: { drinkId, consumptionIndex },
      }: PayloadAction<{ drinkId: string; consumptionIndex: number }>
    ) => {
      if (state.status !== 'active') {
        return;
      }

      const drink = state.drinks.find((currentDrink) => currentDrink.id === drinkId);
      if (!drink) {
        return;
      }

      drink.consumptions.splice(consumptionIndex, 1);
    },
    updateConsumption: (
      state,
      {
        payload,
      }: PayloadAction<{
        drinkId: string;
        consumptionIndex: number;
        updatedConsumption: Partial<Omit<DrinkConsumptionModel, 'id'>>;
      }>
    ) => {
      if (state.status !== 'active') {
        return;
      }

      const drink = state.drinks.find((currentDrink) => currentDrink.id === payload.drinkId);
      if (!drink) {
        return;
      }

      const consumption = drink.consumptions[payload.consumptionIndex];
      if (!consumption) {
        return;
      }

      drink.consumptions[payload.consumptionIndex] = {
        ...consumption,
        ...payload.updatedConsumption,
      };
    },
    finishConsumption: (
      state,
      {
        payload: { drinkId, conumptionIndex },
      }: PayloadAction<{ drinkId: string; conumptionIndex: number }>
    ) => {
      if (state.status !== 'active') {
        return;
      }

      const drink = state.drinks.find((currentDrink) => currentDrink.id === drinkId);
      if (!drink) {
        return;
      }

      const consumption = drink.consumptions[conumptionIndex];
      if (!consumption) {
        return;
      }

      const currentTime = now();
      const startTime = consumption.startTime;

      consumption.endTime = currentTime > startTime ? currentTime : startTime;
    },
    finishAllOpenConsumptions: (state) => {
      if (state.status !== 'active') {
        return;
      }

      state.drinks.forEach((drink) => {
        drink.consumptions.forEach((consumption) => {
          if (consumption.endTime === undefined) {
            const currentTime = now();
            const startTime = consumption.startTime;

            consumption.endTime = currentTime > startTime ? currentTime : startTime;
          }
        });
      });
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
  addConsumption: addConsumptionAction,
  removeConsumption: removeConsumptionAction,
  updateConsumption: updateConsumptionAction,
  finishConsumption: finishConsumptionAction,
  finishAllOpenConsumptions: finishAllOpenConsumptionsAction,
} = drinkSessionStateSlice.actions;
export const { isDrinkSessionActiveSelector, drinksSelector } = drinkSessionStateSlice.selectors;
