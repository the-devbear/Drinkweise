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
  'id' | 'name' | 'default_volume' | 'alcohol' | 'type'
> & {
  barcodes: { barcode: string }[];
};

export class DrinksService implements IDrinkService {
  public readonly DEFAULT_PAGE_SIZE = 20;

  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async getPaginatedDrinks(
    userId: string,
    cursor: string
  ): Result<AddDrinkModel[], PostgrestError> {
    const query = this.createDefaultQuery(userId)
      .order('id', { ascending: true })
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

  public async searchDrinksByName(
    userId: string,
    name: string
  ): Result<AddDrinkModel[], PostgrestError> {
    const { data, error } = await this.createDefaultQuery(userId).ilike('name', `%${name}%`);

    if (error) {
      return { error };
    }

    if (!data) {
      return { value: [] };
    }

    return { value: data.map(this.mapDrink) };
  }

  public async searchDrinksByBarcode(
    userId: string,
    barcode: string
  ): Result<AddDrinkModel[], PostgrestError> {
    const { data, error } = await this.createDefaultQuery(userId, true).eq(
      'barcodes.barcode',
      barcode
    );

    if (error) {
      return { error };
    }

    if (!data) {
      return { value: [] };
    }

    return { value: data.map(this.mapDrink) };
  }

  public async createDrink(
    userId: string,
    drink: Omit<AddDrinkModel, 'id'>
  ): Result<void, PostgrestError> {
    const { data, error } = await this.supabase
      .from('drinks')
      .insert({
        name: drink.name,
        type: drink.type,
        alcohol: drink.alcohol,
        default_volume: drink.defaultVolume,
        created_by: userId,
      })
      .select('id')
      .single();

    if (error) {
      return { error };
    }

    if (drink.barcodes.length !== 0) {
      const { error: barcodeError } = await this.supabase
        .from('drink_barcodes')
        .insert(drink.barcodes.map((barcode) => ({ barcode, drink_id: data.id })));

      if (barcodeError) {
        return { error: barcodeError };
      }
    }

    return { value: undefined };
  }

  private createDefaultQuery(userId: string, innerJoin = false) {
    const joinType = innerJoin ? '!inner' : '';
    return this.supabase
      .from('drinks')
      .select(
        `id, name, default_volume, alcohol, barcodes:drink_barcodes${joinType}(barcode), type`
      )
      .or(`created_by.is.null, created_by.eq.${userId}`);
  }

  private mapDrink(supabaseDrink: DrinkSelectResult): AddDrinkModel {
    return {
      id: supabaseDrink.id,
      name: supabaseDrink.name,
      defaultVolume: supabaseDrink.default_volume,
      alcohol: supabaseDrink.alcohol,
      barcodes: supabaseDrink.barcodes.map(({ barcode }) => barcode),
      type: tryMapToEnum(DrinkTypeEnum, supabaseDrink.type) ?? DrinkTypeEnum.OTHER,
    };
  }
}
