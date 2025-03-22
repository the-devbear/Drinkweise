import { storage } from '@drinkweise/lib/storage/mmkv';
import { COLORS } from '@drinkweise/theme/colors';
import * as NavigationBar from 'expo-navigation-bar';
import { colorScheme, useColorScheme as useNativewindColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

const SELECTED_THEME_KEY = 'selected-theme';
export type ColorScheme = 'light' | 'dark' | 'system';

function useColorScheme() {
  const { colorScheme: nativeWindColorScheme, setColorScheme: setNativeWindColorScheme } =
    useNativewindColorScheme();
  const [selectedColorScheme, setSelectedColorScheme] = useMMKVString(SELECTED_THEME_KEY);

  async function setColorScheme(colorScheme: ColorScheme) {
    setNativeWindColorScheme(colorScheme);
    setSelectedColorScheme(colorScheme);
    if (Platform.OS !== 'android') return;
    try {
      await setNavigationBar(colorScheme);
    } catch (error) {
      console.error('useColorScheme.tsx", "setColorScheme', error);
    }
  }

  const colorScheme = ((selectedColorScheme ?? nativeWindColorScheme) as ColorScheme) ?? 'system';
  const color = (colorScheme === 'system' ? nativeWindColorScheme : colorScheme) ?? 'light';

  return {
    colorScheme,
    isDarkColorScheme:
      colorScheme === 'dark' || (colorScheme === 'system' && nativeWindColorScheme === 'dark'),
    setColorScheme,
    colors: COLORS[color],
  };
}

/**
 * Set the Android navigation bar color based on the color scheme.
 */
function useInitialAndroidBarSync() {
  const { colorScheme } = useColorScheme();
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    setNavigationBar(colorScheme).catch((error) => {
      console.error('useColorScheme.tsx", "useInitialColorScheme', error);
    });
  }, [colorScheme]);
}

export { useColorScheme, useInitialAndroidBarSync };

function setNavigationBar(colorScheme: ColorScheme) {
  return Promise.all([
    NavigationBar.setButtonStyleAsync(colorScheme === 'dark' ? 'light' : 'dark'),
    NavigationBar.setPositionAsync('absolute'),
    NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#00000030' : '#ffffff80'),
  ]);
}

export const loadSelectedTheme = () => {
  const theme = storage.getString(SELECTED_THEME_KEY);
  if (theme !== undefined) {
    colorScheme.set(theme as ColorScheme);
  }
};
