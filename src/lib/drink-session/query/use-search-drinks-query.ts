import { supabase } from '@drinkweise/lib/supabase';
import { tryMapToEnum } from '@drinkweise/lib/utils/enum';
import { DrinkTypeEnum } from '@drinkweise/store/drink-session/enums/drink-type.enum';
import { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const SEARCH_DRINKS_QUERY_KEY = 'drinks' as const;

export function useSearchDrinksQuery(searchString: string, debouncedSearchString: string) {
  // TODO: Rename this query?
  const infiniteQuery = useInfiniteQuery({
    queryKey: [SEARCH_DRINKS_QUERY_KEY],
    initialPageParam: '',
    queryFn: async ({ pageParam, signal }): Promise<AddDrinkModel[]> => {
      // TODO: This is going to be extracted into a service
      const query = supabase
        .from('drinks')
        .select('id, name, alcohol, default_volume, type, barcode')
        .order('id', { ascending: true })
        .abortSignal(signal)
        .limit(10);

      if (pageParam !== '') {
        query.gt('id', pageParam);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      console.log('data', data);

      return data.map((drink) => ({
        id: drink.id,
        name: drink.name,
        alcohol: drink.alcohol,
        defaultVolume: drink.default_volume,
        type: tryMapToEnum(DrinkTypeEnum, drink.type) ?? DrinkTypeEnum.OTHER,
        barcode: drink.barcode ?? undefined,
      }));
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
    queryKey: [SEARCH_DRINKS_QUERY_KEY, debouncedSearchString],
    queryFn: async ({ signal }): Promise<AddDrinkModel[]> => {
      // TODO: This is going to be extracted into a service
      if (!debouncedSearchString) {
        return [];
      }

      const { data, error } = await supabase
        .from('drinks')
        .select('id, name, alcohol, default_volume, type')
        .abortSignal(signal)
        .ilike('name', `%${debouncedSearchString}%`);

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      return data.map((drink) => ({
        id: drink.id,
        name: drink.name,
        alcohol: drink.alcohol,
        defaultVolume: drink.default_volume,
        type: tryMapToEnum(DrinkTypeEnum, drink.type) ?? DrinkTypeEnum.OTHER,
      }));
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
