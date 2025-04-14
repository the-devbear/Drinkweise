import { storage } from '@drinkweise/lib/storage/mmkv';
import type { AppDispatch, RootState } from '@drinkweise/store';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { cancelDrinkSessionAction } from '..';
import { drinkSessionSlice } from '../drink-session.slice';

export const persistDrinkSessionStateMiddleware = createListenerMiddleware();

const LISTENER_DELAY = 1500;

const startPersistDrinkSessionStateListener =
  persistDrinkSessionStateMiddleware.startListening.withTypes<RootState, AppDispatch>();

export const persistDrinkSessionStateListener = startPersistDrinkSessionStateListener({
  predicate: (action) =>
    action.type.startsWith(drinkSessionSlice) || signOutAction.fulfilled.match(action),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    await listenerApi.delay(LISTENER_DELAY);

    if (isAnyOf(signOutAction.fulfilled, cancelDrinkSessionAction)(action)) {
      console.info('[DRINK] Deleting drink session state', action.type);
      storage.delete(drinkSessionSlice);
      return;
    }

    console.info('[DRINK] Persisting drink session state');
    storage.set(drinkSessionSlice, JSON.stringify(listenerApi.getState().drinkSession));
  },
});
