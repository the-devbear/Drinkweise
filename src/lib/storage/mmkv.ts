import { SupportedStorage } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const supabaseStorage: SupportedStorage = {
  getItem: (key) => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: (key) => storage.delete(key),
};
