import type { DrinkType } from '@drinkweise/store/drink-session/enums/drink-type.enum';

import { never } from '../utils/never';

export function mapDrinkTypeToName(type: DrinkType): string {
  switch (type) {
    case 'beer':
      return 'Beer';
    case 'spirit':
      return 'Spirit';
    case 'red-wine':
      return 'Red Wine';
    case 'white-wine':
      return 'White Wine';
    case 'other':
      return 'Other';
    default:
      never(type);
  }
}
