import type { Gender } from '@drinkweise/store/user/enums/gender';

import type { ConsumptionData } from './consumption-data.model';

export interface BACCalculationInput {
  startTime: number;
  consumptions: ConsumptionData[];
  gender?: Gender;
  weight: number;
  height: number;
  intervalMinutes?: number;
  endTime?: number;
}
