// This file is used to load environment variables from a .env files or EAS Secrets.
// It needs to be a JavaScript file because it is used in the app.config.js file.
const z = require('zod');

const packageJson = require('./package.json');
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'eas';

if (APP_ENV === 'eas') {
  process.env.EXPO_PUBLIC_SUPABASE_URL ??= 'https://expo.dev/';
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= '';
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??= '';
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ??= '';
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME ??= 'com.googleusercontent.apps.1234567890';
}

/** IOS Bundle ID */
const BUNDLE_ID = 'com.drinkweise.app';
/** Android Package name */
const PACKAGE = 'com.drinkweise.app';
const VERSION = packageJson.version;

const clientEnvironmentSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production', 'eas']),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),

  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  GOOGLE_WEB_CLIENT_ID: z.string(),
  GOOGLE_IOS_CLIENT_ID: z.string(),
});

const buildTimeEnvironmentSchema = z.object({
  GOOGLE_IOS_URL_SCHEME: z.string(),
});

/**
 * @type {z.infer<typeof clientEnvironmentSchema>}
 */
const _clientEnvironment = {
  APP_ENV,
  BUNDLE_ID,
  PACKAGE,
  VERSION,

  // Custom environment variables
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};

/**
 * Add build time environment variables here
 * This should only be used inside of `app.config.js`
 * @type {z.infer<typeof buildTimeEnvironmentSchema>}
 */
const _buildTimeEnvironment = {
  // Add build time environment variables here
  GOOGLE_IOS_URL_SCHEME: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
};

const _mergedEnvironment = {
  ..._clientEnvironment,
  ..._buildTimeEnvironment,
};

const merged = buildTimeEnvironmentSchema.merge(clientEnvironmentSchema);
const parsed = merged.safeParse(_mergedEnvironment);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
    `\n🔍 Missing variables in .env.${APP_ENV} file or in EAS Secrets. Make sure all required variables are defined in this .env.${APP_ENV} file or EAS Secrets.`,
    `\n🤔 Tip: If you recently updated the .env.${APP_ENV} file and the error still persists, try restarting the server with the -c flag to clear the cache.`
  );
  throw new Error('Invalid environment variables');
}

const buildTimeEnvironment = parsed.data;
const environment = clientEnvironmentSchema.parse(buildTimeEnvironment);

module.exports = {
  buildTimeEnvironment,
  environment,
};
