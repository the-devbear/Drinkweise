import { storage } from '@drinkweise/lib/storage/mmkv';
import { now } from '@drinkweise/lib/utils/date/now';
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { isBefore } from 'date-fns';

import { completeDrinkSessionAction } from './actions/complete-drink-session.action';
import { drinkSessionSlice } from './drink-session.slice';
import type { AddDrinkModel } from './models/add-drink.model';
import type { DrinkConsumptionModel } from './models/consumption.model';
import {
  type DrinkSessionState,
  initialDrinkSessionState,
} from './models/drink-session-state.model';
import { signOutAction } from '../user/actions/sign-out.action';

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
        note: '',
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
        payload: { consumptionIndex, drinkId, updatedConsumption },
      }: PayloadAction<{
        drinkId: string;
        consumptionIndex: number;
        updatedConsumption: Partial<Omit<DrinkConsumptionModel, 'id'>>;
      }>
    ) => {
      if (state.status !== 'active') {
        return;
      }

      const drink = state.drinks.find((currentDrink) => currentDrink.id === drinkId);
      if (!drink) {
        return;
      }

      const consumption = drink.consumptions[consumptionIndex];
      if (!consumption) {
        return;
      }

      if (updatedConsumption.startTime && isBefore(updatedConsumption.startTime, state.startTime)) {
        state.startTime = updatedConsumption.startTime;
      }

      drink.consumptions[consumptionIndex] = {
        ...consumption,
        ...updatedConsumption,
      };
    },
    finishConsumption: (
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

      const consumption = drink.consumptions[consumptionIndex];
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
    updateSessionStartTimeToEarliestConsumption: (state) => {
      if (state.status !== 'active') {
        return;
      }
      const earliestStartTime = state.drinks.reduce((earliest, drink) => {
        const earliestConsumptionTimestamp = drink.consumptions.reduce<number | undefined>(
          (earliestTimestamp, consumption) =>
            earliestTimestamp === undefined
              ? consumption.startTime
              : Math.min(earliestTimestamp, consumption.startTime),
          undefined
        );

        if (!earliestConsumptionTimestamp) {
          return earliest;
        }

        return Math.min(earliest, earliestConsumptionTimestamp);
      }, state.startTime);
      state.startTime = earliestStartTime;
    },
    updateSessionName: (state, { payload: { name } }: PayloadAction<{ name: string }>) => {
      if (state.status !== 'active') {
        return;
      }
      state.name = name;
    },
    updateSessionNote: (state, { payload: { note } }: PayloadAction<{ note: string }>) => {
      if (state.status !== 'active') {
        return;
      }
      state.note = note;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        completeDrinkSessionAction.fulfilled,
        signOutAction.fulfilled,
        signOutAction.rejected
      ),
      () => initialDrinkSessionState
    );
  },
  selectors: {
    isDrinkSessionActiveSelector: (state): boolean => state.status === 'active',
    drinksSelector: (state) => (state.status === 'active' ? state.drinks : undefined),
    activeDrinkSessionSelector: (state) => (state.status === 'active' ? state : undefined),
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
  updateSessionStartTimeToEarliestConsumption: updateSessionStartTimeToEarliestConsumptionAction,
  finishConsumption: finishConsumptionAction,
  finishAllOpenConsumptions: finishAllOpenConsumptionsAction,
  updateSessionName: updateSessionNameAction,
  updateSessionNote: updateSessionNoteAction,
} = drinkSessionStateSlice.actions;
export const { isDrinkSessionActiveSelector, drinksSelector, activeDrinkSessionSelector } =
  drinkSessionStateSlice.selectors;
