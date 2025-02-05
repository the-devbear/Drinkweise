import { router } from 'expo-router';

/**
 * @param {import("expo/config").ConfigContext} config
 * @returns {import("expo/config").ExpoConfig}
 */
export default ({ config }) => ({
  ...config,
  name: 'Drinkweise',
  slug: 'Drinkweise',
  version: '0.0.1', // TODO:
  scheme: 'drinkweise',
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-dev-client',
      {
        launcherMode: 'most-recent',
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#FFFFFF',
        image: './assets/splash-icon.png',
        dark: {
          image: './assets/splash-icon.png',
          backgroundColor: '#000000',
        },
        imageWidth: 200,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    assetPatternsToBeBundled: ['**/*'],
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.drinkweise.app', // TODO
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: 'com.drinkweise.app', // TODO
  },
  owner: 'dev_bear',
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '967b29ad-3025-4104-a84e-d8a90004442a',
    },
  },
});
