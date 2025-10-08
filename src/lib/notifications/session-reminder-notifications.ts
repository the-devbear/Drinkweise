import { minutesToSeconds } from 'date-fns';
import * as Notifications from 'expo-notifications';

type ReminderNotification = {
  id: `session-reminder-${'30' | '45' | '60'}`;
  title: string;
  body: string;
  scheduledInMinutes: number;
};

const REMINDER_NOTIFICATIONS: ReminderNotification[] = [
  {
    id: 'session-reminder-30',
    title: "Don't forget to track!",
    body: "It's been 30 minutes. Make sure your consumptions are up to date.",
    scheduledInMinutes: 30,
  },
  {
    id: 'session-reminder-45',
    title: 'Still drinking or end session?',
    body: 'Are you still drinking or do you want to end your session?',
    scheduledInMinutes: 45,
  },
  {
    id: 'session-reminder-60',
    title: 'Last follow up',
    body: "It's been an hour. Do you want to add another drink or end your session?",
    scheduledInMinutes: 60,
  },
] as const;

export async function scheduleSessionReminderNotifications() {
  const currentBadgeCount = await Notifications.getBadgeCountAsync();
  console.info('[NOTIFICATIONS] Scheduling session reminder notifications');
  await Promise.all(
    REMINDER_NOTIFICATIONS.map(async (notification, index) => {
      await Notifications.scheduleNotificationAsync({
        identifier: notification.id,
        content: {
          title: notification.title,
          body: notification.body,
          sound: true,
          badge: currentBadgeCount + index + 1,
          data: {
            url: '/drinks/session',
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: minutesToSeconds(notification.scheduledInMinutes),
        },
      });
      console.info(`[NOTIFICATIONS] Scheduled notification ${notification.id}`);
    })
  );
}

export async function cancelSessionReminderNotifications() {
  await Promise.all(
    REMINDER_NOTIFICATIONS.map(async ({ id }) => {
      await Notifications.cancelScheduledNotificationAsync(id);
      console.info(`[NOTIFICATIONS] Cancelled notification ${id}`);
    })
  );
}

export async function resetBadgeCount() {
  await Notifications.setBadgeCountAsync(0);
}
