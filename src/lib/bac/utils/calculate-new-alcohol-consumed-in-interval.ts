import { addMinutes, isAfter, isBefore } from 'date-fns';

import type { ConsumptionData } from '../models/consumption-data.model';

export const calculateNewAlcoholConsumedInInterval = (
  consumptions: ConsumptionData[],
  intervalStart: number,
  intervalEnd: number,
  averageConsumptionDurationInMinutes: number = 30
): number => {
  return consumptions.reduce((totalAlcoholConsumed, consumption) => {
    const { alcoholInGrams, startTime, endTime } = consumption;

    const effectiveEndTime =
      endTime ?? addMinutes(startTime, averageConsumptionDurationInMinutes).getTime();

    // Skip consumptions when outside of span
    if (isAfter(startTime, intervalEnd) || isBefore(effectiveEndTime, intervalStart)) {
      return totalAlcoholConsumed;
    }

    if (effectiveEndTime === startTime) {
      return totalAlcoholConsumed + alcoholInGrams;
    }

    const overlapStart = Math.max(startTime, intervalStart);
    const overlapEnd = Math.min(effectiveEndTime, intervalEnd);

    const consumptionDurationMs = effectiveEndTime - startTime;
    const overlapDurationMs = overlapEnd - overlapStart;

    const consumptionRatio = overlapDurationMs / consumptionDurationMs;

    return totalAlcoholConsumed + alcoholInGrams * consumptionRatio;
  }, 0);
};
