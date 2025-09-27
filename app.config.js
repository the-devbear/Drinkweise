import { buildTimeEnvironment, environment } from './env';

/**
 * @param {import("expo/config").ConfigContext} config
 * @returns {import("expo/config").ExpoConfig}
 */
export default ({ config }) => ({
  ...config,
  name: 'Drinkweise',
  slug: 'Drinkweise',
  version: buildTimeEnvironment.VERSION.toString(),
  scheme: 'drinkweise',
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-apple-authentication',
    'expo-localization',
    'expo-web-browser',
    'expo-font',
    [
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme: buildTimeEnvironment.GOOGLE_IOS_URL_SCHEME,
      },
    ],
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
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera, so you can scan barcodes.',
      },
    ],
    'expo-background-task',
    [
      'expo-notifications',
      {
        enableBackgroundRemoteNotifications: true,
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
    url: 'https://u.expo.dev/967b29ad-3025-4104-a84e-d8a90004442a',
    assetPatternsToBeBundled: ['**/*'],
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: buildTimeEnvironment.BUNDLE_ID,
    usesAppleSignIn: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    package: buildTimeEnvironment.PACKAGE,
    softwareKeyboardLayoutMode: 'pan',
  },
  owner: 'dev_bear',
  extra: {
    ...environment,
    router: {
      origin: false,
    },
    eas: {
      projectId: '967b29ad-3025-4104-a84e-d8a90004442a',
    },
  },
});
