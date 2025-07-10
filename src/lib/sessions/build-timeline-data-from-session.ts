import { tryMapToEnum } from '@drinkweise/lib/utils/enum';
import { DrinkTypeEnum } from '@drinkweise/store/drink-session/enums/drink-type.enum';

import type {
  ConsumptionsTimelinePointDrinkModel,
  ConsumptionsTimelinePointModel,
} from './models/consumptions-timeline-point.model';

export function buildTimelineDataFromSession(
  sessionConsumptions: {
    id: number;
    name: string;
    type: string;
    alcohol: number;
    volume: number;
    startTime: string;
  }[]
): ConsumptionsTimelinePointModel[] {
  return Array.from(
    sessionConsumptions.reduce((timelineDrinkMap, consumption) => {
      const timeKey = new Date(consumption.startTime).setSeconds(0, 0);

      if (!timelineDrinkMap.has(timeKey)) {
        timelineDrinkMap.set(timeKey, []);
      }

      timelineDrinkMap.get(timeKey)?.push({
        id: consumption.id,
        type: tryMapToEnum(DrinkTypeEnum, consumption.type) ?? DrinkTypeEnum.OTHER,
        name: consumption.name,
        volume: consumption.volume,
        alcohol: consumption.alcohol,
      });
      return timelineDrinkMap;
    }, new Map<number, ConsumptionsTimelinePointDrinkModel[]>())
  ).map(([time, drinks]) => ({ time, drinks }));
}
