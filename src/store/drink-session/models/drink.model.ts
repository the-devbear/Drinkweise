import type { DrinkConsumptionModel } from './consumption.model';
import type { DrinkType } from '../enums/drink-type.enum';

export interface DrinkModel {
  id: string;
  name: string;
  alcohol: number;
  defaultVolume: number;
  type: DrinkType;
  consumptions: DrinkConsumptionModel[];
}
