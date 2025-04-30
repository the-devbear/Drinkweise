import type { IDrinkService } from '@drinkweise/api/drinks/interfaces/drinks.service-api';
import type { Result } from '@drinkweise/lib/types/result.types';
import type { TypedSupabaseClient } from '@drinkweise/lib/types/supabase.types';
import { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

export class DrinksService implements IDrinkService {
  constructor(private readonly supabase: TypedSupabaseClient) {}

  public async getPaginatedDrinks(cursor: string): Result<AddDrinkModel[]> {
    return { value: [] };
  }

  public async searchDrinks(search: string): Result<AddDrinkModel[]> {
    return { value: [] };
  }
}
