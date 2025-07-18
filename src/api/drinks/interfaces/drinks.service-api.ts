import type { Result } from '@drinkweise/lib/types/result.types';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

export interface IDrinkService {
  readonly DEFAULT_PAGE_SIZE: number;
  getPaginatedDrinks: (userId: string, cursor: string) => Result<AddDrinkModel[]>;
  searchDrinksByName: (userId: string, search: string) => Result<AddDrinkModel[]>;
  searchDrinksByBarcode: (userId: string, barcode: string) => Result<AddDrinkModel[]>;
  createDrink: (userId: string, drink: Omit<AddDrinkModel, 'id'>) => Result<void>;
}
