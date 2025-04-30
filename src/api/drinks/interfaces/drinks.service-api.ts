import type { Result } from '@drinkweise/lib/types/result.types';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

export interface IDrinkService {
  getPaginatedDrinks: (userId: string, cursor: string) => Result<AddDrinkModel[]>;
  searchDrinks: (userId: string, search: string) => Result<AddDrinkModel[]>;
}
