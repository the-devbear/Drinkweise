import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';

const ALCOHOL_DENSITY = 0.8;

export function calculateTotalGramsOfAlcoholConsumed(drinks: DrinkModel[]): number {
  return drinks.reduce((previous, drink) => {
    const totalDrinkVolume = drink.consumptions.reduce((previousVolume, consumption) => {
      if (consumption.endTime === undefined) {
        return previousVolume;
      }
      return previousVolume + consumption.volume;
    }, 0);

    return previous + totalDrinkVolume * (drink.alcohol / 100) * ALCOHOL_DENSITY;
  }, 0);
}
