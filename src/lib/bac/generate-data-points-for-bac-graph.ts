import { addHours, minutesToMilliseconds, roundToNearestMinutes } from 'date-fns';
import { minutesInHour } from 'date-fns/constants';

import type { BACCalculationInput } from './models/bac-calculation-input.model';
import type { BACDataPoint } from './models/bac-data-point.model';
import { ALCOHOL_ELIMINATION_RATE_PER_HOUR } from './utils/alcohol-elimination-rate.const';
import { calculateNewAlcoholConsumedInInterval } from './utils/calculate-new-alcohol-consumed-in-interval';
import { prepareSeidlDistributionFactor } from './utils/prepare-seidl-distribution-factor';
import { now } from '../utils/date/now';

export function generateDataPointsForBACGraph({
  startTime,
  consumptions,
  gender,
  weight,
  height,
  intervalMinutes = 30,
  endTime,
}: BACCalculationInput): BACDataPoint[] {
  if (consumptions.length === 0) {
    return [];
  }
  const dataPoints: BACDataPoint[] = [];
  const distributionFactor = prepareSeidlDistributionFactor(gender, weight, height);

  const newStartTime = roundToNearestMinutes(startTime, {
    nearestTo: 30,
    roundingMethod: 'floor',
  }).getTime();

  const threeHoursLater = addHours(endTime ?? now(), 3);

  const newEndTime = roundToNearestMinutes(threeHoursLater, {
    nearestTo: 30,
    roundingMethod: 'ceil',
  }).getTime();

  const intervalMilliseconds = minutesToMilliseconds(intervalMinutes);
  const intervalHours = intervalMinutes / minutesInHour;

  let previousBAC = 0;
  let previousTime = newStartTime;

  for (let timePoint = newStartTime; timePoint <= newEndTime; timePoint += intervalMilliseconds) {
    const newAlcoholConsumed = calculateNewAlcoholConsumedInInterval(
      consumptions,
      previousTime,
      timePoint
    );

    const addedBAC = newAlcoholConsumed / (weight * distributionFactor);
    const eliminatedBAC = intervalHours * ALCOHOL_ELIMINATION_RATE_PER_HOUR;

    const currentBAC = Math.max(0, previousBAC + addedBAC - eliminatedBAC);

    dataPoints.push({
      bloodAlcoholContent: currentBAC,
      time: timePoint,
    });

    previousTime = timePoint;
    previousBAC = currentBAC;
  }

  return dataPoints;
}
