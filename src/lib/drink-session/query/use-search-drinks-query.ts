import { drinksService } from '@drinkweise/api/drinks';
import { useAppSelector } from '@drinkweise/store';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';
import { userSelector } from '@drinkweise/store/user';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const SEARCH_DRINKS_QUERY_KEY = 'drinks' as const;

export function useSearchDrinksQuery(searchString: string, debouncedSearchString: string) {
  const userId = useAppSelector(userSelector)?.id;

  if (!userId) {
    throw new Error('User ID is required');
  }

  // TODO: Rename this query?
  const infiniteQuery = useInfiniteQuery({
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
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPage.at(-1)!.id;
    },
  });

  const filteredData = useMemo(() => {
    const drinks = infiniteQuery.data?.pages.flat();
    if (!drinks) {
      return [];
    }

    if (!searchString) {
      return drinks;
    }

    // TODO: Create a rule for this
    const lowerCaseSearchString = searchString.trim().toLowerCase();
    return drinks.filter((drink) => drink.name.toLowerCase().includes(lowerCaseSearchString));
  }, [infiniteQuery.data?.pages, searchString]);

  const isSearchQueryActive = useMemo(
    () =>
      debouncedSearchString.length > 0 && filteredData.length === 0 && !infiniteQuery.isFetching,
    [debouncedSearchString.length, filteredData.length, infiniteQuery.isFetching]
  );

  const searchQuery = useQuery({
    queryKey: [SEARCH_DRINKS_QUERY_KEY, userId, debouncedSearchString],
    queryFn: async (): Promise<AddDrinkModel[]> => {
      if (!debouncedSearchString) {
        return [];
      }

      const { value, error } = await drinksService.searchDrinks(userId, debouncedSearchString);

      if (error) {
        throw new Error(error.message);
      }

      return value;
    },
    enabled: isSearchQueryActive,
  });

  return {
    drinks: filteredData.length > 0 ? filteredData : (searchQuery.data?.flat() ?? []),
    isSearchQueryActive,
    infiniteQuery,
    searchQuery,
  };
}
