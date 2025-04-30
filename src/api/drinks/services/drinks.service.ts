import type { IDrinkService } from '@drinkweise/api/drinks/interfaces/drinks.service-api';
import type { Tables } from '@drinkweise/lib/types/generated/supabase.types';
import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import { tryMapToEnum } from '@drinkweise/lib/utils/enum';
import { DrinkTypeEnum } from '@drinkweise/store/drink-session/enums/drink-type.enum';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';
import type { PostgrestError } from '@supabase/supabase-js';

type DrinkSelectResult = Pick<
  Tables<'drinks'>,
  'id' | 'name' | 'default_volume' | 'alcohol' | 'barcode' | 'type'
>;

export class DrinksService implements IDrinkService {
  public readonly DEFAULT_PAGE_SIZE = 20;

  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async getPaginatedDrinks(
    userId: string,
    cursor: string
  ): Result<AddDrinkModel[], PostgrestError> {
    const query = this.supabase
      .from('drinks')
      .select('id, name, default_volume, alcohol, barcode, type')
      .order('id', { ascending: true })
      .or(`created_by.is.null, created_by.eq.${userId}`)
      .limit(this.DEFAULT_PAGE_SIZE);

    if (cursor) {
      query.gt('id', cursor);
    }

    const { data, error } = await query;

    if (error) {
      return { error };
    }

    if (!data) {
      return { value: [] };
    }

    return { value: data.map(this.mapDrink) };
  }

  public async searchDrinks(userId: string, search: string): Result<AddDrinkModel[]> {
    return { value: [] };
  }

  private mapDrink(supabaseDrink: DrinkSelectResult): AddDrinkModel {
    return {
      id: supabaseDrink.id,
      name: supabaseDrink.name,
      defaultVolume: supabaseDrink.default_volume,
      alcohol: supabaseDrink.alcohol,
      barcode: supabaseDrink.barcode ?? undefined,
      type: tryMapToEnum(DrinkTypeEnum, supabaseDrink.type) ?? DrinkTypeEnum.OTHER,
    };
  }
}
