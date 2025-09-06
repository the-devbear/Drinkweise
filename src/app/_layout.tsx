import '../../global.css';
import 'expo-dev-client';
import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { useNotificationRoutingObserver } from '@drinkweise/lib/notifications/hooks/use-notificiation-routing-observer';
import { useColorScheme, useInitialAndroidBarSync } from '@drinkweise/lib/useColorScheme';
import { queryClient } from '@drinkweise/lib/utils/query/query-client';
import {
  MAX_AGE_IN_MILLISECONDS,
  persister,
  shouldDehydrateQuery,
} from '@drinkweise/lib/utils/query/tanstack-query.config';
import { AuthProvider } from '@drinkweise/providers/AuthProvider';
import { rootStore } from '@drinkweise/store';
import { NAV_THEME } from '@drinkweise/theme';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import * as Notifications from 'expo-notifications';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Provider as ReduxProvider } from 'react-redux';
import '@drinkweise/components/css-interopts';
import { resetBadgeCount } from '@drinkweise/lib/notifications/session-reminder-notifications';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    console.debug('[QUERY] Network state changed', state.isConnected);
    setOnline(!!state.isConnected);
  });
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactQueryDevTools(queryClient);
  useReactNavigationDevTools(navigationRef);
  useMMKVDevTools();

  useInitialAndroidBarSync();
  useNotificationRoutingObserver();
  const { isDarkColorScheme } = useColorScheme();
  React.useEffect(() => {
    // Set small timeout, so the splash screen doesn't flicker.
    // Also so the user doesn't get to see the home screen for a second before maybe being redirected
    new Promise((resolve) => setTimeout(resolve, 250)).then(() => {
      SplashScreen.hide();
    });

    // We are currently only using the badge count for the reminder notifications, so
    // we can safely reset it here.
    resetBadgeCount();
  }, []);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
              persister,
              maxAge: MAX_AGE_IN_MILLISECONDS,
              dehydrateOptions: {
                shouldDehydrateQuery,
              },
            }}>
            <ReduxProvider store={rootStore}>
              <BottomSheetModalProvider>
                <ActionSheetProvider>
                  <NavThemeProvider value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}>
                    <AuthProvider>
                      <Stack initialRouteName='(auth)' screenOptions={{ headerShown: false }}>
                        <Stack.Screen name='(auth)' />
                        <Stack.Screen name='(app)' />
                        <Stack.Screen name='onboarding' />
                      </Stack>
                    </AuthProvider>
                  </NavThemeProvider>
                </ActionSheetProvider>
              </BottomSheetModalProvider>
            </ReduxProvider>
          </PersistQueryClientProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </>
  );
}
