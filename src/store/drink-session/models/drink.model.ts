import type { DrinkConsumption } from './consumption.model';
import type { DrinkType } from '../enums/drink-type.enum';

export interface Drink {
  id: string;
  name: string;
  alcohol: number;
  defaultVolume: number;
  type: DrinkType;
  consumptions: DrinkConsumption[];
}
