import { calculateGramsOfAlcohol } from '@drinkweise/lib/utils/calculations/calculate-grams-of-alcohol';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';

import type { ConsumptionData } from '../models/consumption-data.model';

export const prepareDrinksForBACCalculation = (drinks: DrinkModel[]): ConsumptionData[] =>
  drinks.flatMap((drink) =>
    drink.consumptions.map((consumption) => ({
      alcoholInGrams: calculateGramsOfAlcohol(consumption.volume, drink.alcohol),
      startTime: consumption.startTime,
      endTime: consumption.endTime,
    }))
  );
