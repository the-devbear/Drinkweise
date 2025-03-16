import { storage } from '@drinkweise/lib/storage/mmkv';
import { createListenerMiddleware } from '@reduxjs/toolkit';

import { userSlice } from '../user.slice';
import type { AppDispatch, RootState } from './../../index';

export const persistUserStateMiddleware = createListenerMiddleware();

const LISTENER_DELAY = 5000;

const startPersistUserStateListener = persistUserStateMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

export const persistUserStateListener = startPersistUserStateListener({
  predicate: (action) => action.type.startsWith(userSlice),
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    await listenerApi.delay(LISTENER_DELAY);

    console.info('Persisting user state');
    storage.set(userSlice, JSON.stringify(listenerApi.getState().user));
  },
});
