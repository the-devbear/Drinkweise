import { configureStore, createDraftSafeSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

import { userStateSlice } from './user';
import { persistUserStateMiddleware } from './user/middleware/persist-user-state.middleware';

export const rootStore = configureStore({
  reducer: {
    [userStateSlice.name]: userStateSlice.reducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistUserStateMiddleware.middleware),
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(
      devToolsEnhancer({
        name: 'Drinkweise',
      })
    ),
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const createSelector = createDraftSafeSelector.withTypes<RootState>();
