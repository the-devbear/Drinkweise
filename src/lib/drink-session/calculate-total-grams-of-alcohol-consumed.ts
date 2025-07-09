import { calculateGramsOfAlcohol } from '@drinkweise/lib/utils/calculations/calculate-grams-of-alcohol';
import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';

export function calculateTotalGramsOfAlcoholConsumed(drinks: DrinkModel[]): number {
  return drinks.reduce((previous, drink) => {
    const totalDrinkVolume = drink.consumptions.reduce((previousVolume, consumption) => {
      if (consumption.endTime === undefined) {
        return previousVolume;
      }
      return previousVolume + consumption.volume;
    }, 0);

    return previous + calculateGramsOfAlcohol(totalDrinkVolume, drink.alcohol);
  }, 0);
}
