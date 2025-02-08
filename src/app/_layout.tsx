import '../../global.css';
import 'expo-dev-client';
import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv/build/useMMKVDevTools';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import {
  loadSelectedTheme,
  useColorScheme,
  useInitialAndroidBarSync,
} from '@drinkweise/lib/useColorScheme';
import { NAV_THEME } from '@drinkweise/theme';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

SplashScreen.preventAutoHideAsync();
loadSelectedTheme();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  useMMKVDevTools();

  useInitialAndroidBarSync();
  const { isDarkColorScheme } = useColorScheme();
  SplashScreen.hide();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <NavThemeProvider value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}>
              <Stack initialRouteName='(auth)' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='(auth)' />
                <Stack.Screen name='(app)' />
              </Stack>
            </NavThemeProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}
