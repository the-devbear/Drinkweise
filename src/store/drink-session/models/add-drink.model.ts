import { DrinkType } from '../enums/drink-type.enum';

export interface AddDrinkModel {
  id: string;
  name: string;
  type: DrinkType;
  alcohol: number;
  defaultVolume: number;
  barcode?: string;
}
