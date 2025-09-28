import * as Notifications from 'expo-notifications';
import { type Href, router } from 'expo-router';
import { useEffect } from 'react';

export function useNotificationRoutingObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url as Href);
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      })
      .catch((error) => {
        console.error(
          '[NOTIFICATION OBSERVER] Error while handling last notification response:',
          error
        );
      });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
