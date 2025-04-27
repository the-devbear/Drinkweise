import { storage } from '@drinkweise/lib/storage/mmkv';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

/**
 * The maximum age (30 days) of the query cache in milliseconds.
 */
export const MAX_AGE_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const REACT_QUERY_STORAGE_KEY = 'react-query-cache';

export const persister = createSyncStoragePersister({
  key: REACT_QUERY_STORAGE_KEY,
  throttleTime: 5000,
  storage: {
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});
