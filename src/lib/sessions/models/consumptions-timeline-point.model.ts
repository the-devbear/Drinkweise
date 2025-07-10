import type { DrinkType } from '@drinkweise/store/drink-session/enums/drink-type.enum';

export interface ConsumptionsTimelinePointModel {
  time: number;
  drinks: ConsumptionsTimelinePointDrinkModel[];
}

export interface ConsumptionsTimelinePointDrinkModel {
  id: number;
  type: DrinkType;
  name: string;
  volume: number;
  alcohol: number;
}
