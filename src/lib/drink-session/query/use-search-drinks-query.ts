import { drinksService } from '@drinkweise/api/drinks';
import { filterDrinksRule } from '@drinkweise/lib/drink-session/rules/filter-drinks.rule';
import { shouldSkipEmptyDataKey } from '@drinkweise/lib/utils/query/enums/meta-data-keys';
import { useAppSelector } from '@drinkweise/store';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';
import { userIdSelector } from '@drinkweise/store/user';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const SEARCH_DRINKS_QUERY_KEY = 'drinks' as const;
const STALE_TIME = 21_600_000; // 6 hours

export function useSearchDrinksQuery(searchString: string, debouncedSearchString: string) {
  const userId = useAppSelector(userIdSelector);

  if (!userId) {
    throw new Error('User ID is required');
  }

  const infiniteDrinksQuery = useInfiniteQuery({
    queryKey: [SEARCH_DRINKS_QUERY_KEY, userId],
    initialPageParam: '',
    queryFn: async ({ pageParam }): Promise<AddDrinkModel[]> => {
      const { value, error } = await drinksService.getPaginatedDrinks(userId, pageParam);

      if (error) {
        throw new Error(error.message);
      }

      return value;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length < drinksService.DEFAULT_PAGE_SIZE) {
        return undefined;
      }
      return lastPage.at(-1)!.id;
    },
    staleTime: STALE_TIME,
  });

  const filteredData = useMemo(() => {
    const drinks = infiniteDrinksQuery.data?.pages.flat() ?? [];

    if (!searchString || drinks.length === 0) {
      return drinks;
    }

    return filterDrinksRule(drinks, searchString);
  }, [infiniteDrinksQuery.data?.pages, searchString]);

  const isSearchQueryActive = useMemo(() => {
    if (debouncedSearchString.length === 0) {
      return false;
    }

    return filteredData.length === 0 && !infiniteDrinksQuery.isFetching;
  }, [debouncedSearchString, filteredData.length, infiniteDrinksQuery.isFetching]);

  const searchQuery = useQuery({
    queryKey: [SEARCH_DRINKS_QUERY_KEY, userId, debouncedSearchString],
    queryFn: async (): Promise<AddDrinkModel[] | null> => {
      if (!debouncedSearchString) {
        return null;
      }

      const { value, error } = await drinksService.searchDrinksByName(
        userId,
        debouncedSearchString
      );

      if (error) {
        throw new Error(error.message);
      }

      return value;
    },
    enabled: isSearchQueryActive,
    meta: {
      [shouldSkipEmptyDataKey]: true,
    },
    staleTime: STALE_TIME,
  });

  const drinks = useMemo(
    () => (filteredData.length > 0 ? filteredData : (searchQuery.data ?? [])),
    [filteredData, searchQuery.data]
  );

  return {
    drinks,
    isSearchQueryActive,
    infiniteDrinksQuery,
    searchQuery,
  };
}
