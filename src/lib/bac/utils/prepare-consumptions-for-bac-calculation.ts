import { calculateGramsOfAlcohol } from '@drinkweise/lib/utils/calculations/calculate-grams-of-alcohol';
import { getTime } from 'date-fns';

import type { ConsumptionData } from '../models/consumption-data.model';

export const prepareConsumptionsForBACCalculation = (
  consumptions: {
    alcohol: number;
    volume: number;
    startTime: number | string;
    endTime: number | string;
  }[]
): ConsumptionData[] =>
  consumptions.map(({ volume, alcohol, startTime, endTime }) => ({
    alcoholInGrams: calculateGramsOfAlcohol(volume, alcohol),
    startTime: getTime(startTime),
    endTime: getTime(endTime),
  }));
