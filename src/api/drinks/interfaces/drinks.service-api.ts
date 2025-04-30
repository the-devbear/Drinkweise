import type { Result } from '@drinkweise/lib/types/result.types';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

export interface IDrinkService {
  getPaginatedDrinks: (cursor: string) => Result<AddDrinkModel[]>;
  searchDrinks: (search: string) => Result<AddDrinkModel[]>;
}
