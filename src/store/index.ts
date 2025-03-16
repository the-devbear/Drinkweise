import { configureStore, createDraftSafeSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

export const rootStore = configureStore({
  reducer: {},
  devTools: false,
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
