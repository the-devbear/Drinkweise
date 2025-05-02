import { storage } from '@drinkweise/lib/storage/mmkv';
import { shouldSkipEmptyDataKey } from '@drinkweise/lib/utils/query/enums/meta-data-keys';
import { isEmptyRule } from '@drinkweise/lib/utils/rules/is-empty.rule';
import { defaultShouldDehydrateQuery, type DehydrateOptions } from '@tanstack/query-core';
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

export const shouldDehydrateQuery: DehydrateOptions['shouldDehydrateQuery'] = (query) => {
  const defaultDehydrate = defaultShouldDehydrateQuery(query);
  const shouldSkipEmptyData = query.meta?.[shouldSkipEmptyDataKey];

  if (shouldSkipEmptyData === true) {
    return !isEmptyRule(query.state.data) && defaultDehydrate;
  }

  return defaultDehydrate;
};
