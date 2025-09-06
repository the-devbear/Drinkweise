import {
  cancelSessionReminderNotifications,
  scheduleSessionReminderNotifications,
} from '@drinkweise/lib/notifications/session-reminder-notifications';
import type { AppDispatch, RootState } from '@drinkweise/store';
import { updateNotificationPreferencesAction } from '@drinkweise/store/user';
import { signOutAction } from '@drinkweise/store/user/actions/sign-out.action';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { cancelDrinkSessionAction } from '..';
import { completeDrinkSessionAction } from '../actions/complete-drink-session.action';
import { drinkSessionSlice } from '../drink-session.slice';

const LISTENER_DELAY = 2000;

export const inactivityRemindersMiddleware = createListenerMiddleware();

const startListening = inactivityRemindersMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

const shouldCancelReminderNotifications = isAnyOf(
  signOutAction.fulfilled,
  cancelDrinkSessionAction,
  completeDrinkSessionAction.fulfilled,
  completeDrinkSessionAction.rejected
);

export const inactivityRemindersListener = startListening({
  predicate: (action) =>
    action.type.startsWith(drinkSessionSlice) ||
    signOutAction.fulfilled.match(action) ||
    updateNotificationPreferencesAction.match(action),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const userWantsToReceiveReminderNotifications =
      state.user.user?.notificationPreferences.drinkSession.reminders;
    const isSessionActive = state.drinkSession.status === 'active';

    if (updateNotificationPreferencesAction.match(action)) {
      if (action.payload.drinkSession.reminders && isSessionActive) {
        console.info(
          '[NOTIFICATIONS] Scheduling session reminder notifications reason: user enabled reminders'
        );
        await scheduleSessionReminderNotifications();
      } else {
        console.info(
          '[NOTIFICATIONS] Canceling session reminder notifications reason: user disabled reminders'
        );
        await cancelSessionReminderNotifications();
      }
      return;
    }

    if (!userWantsToReceiveReminderNotifications) {
      return;
    }

    listenerApi.cancelActiveListeners();

    if (shouldCancelReminderNotifications(action)) {
      console.info('[NOTIFICATIONS] Canceling session reminder notifications reason:', action.type);
      await cancelSessionReminderNotifications();
      return;
    }

    await listenerApi.delay(LISTENER_DELAY);
    console.info('[NOTIFICATIONS] Scheduling session reminder notifications reason:', action.type);
    await scheduleSessionReminderNotifications();
  },
});
