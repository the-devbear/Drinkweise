import Constants from 'expo-constants';

/**
 * @type {typeof import('../../env.js').environment}
 */
export const Env = Constants.expoConfig?.extra ?? {};
