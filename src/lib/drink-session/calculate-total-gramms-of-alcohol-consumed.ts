import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';

const ALCOHOL_DENSITY = 0.8;

export function calculateTotalGrammsOfAlcoholConsumed(drinks: DrinkModel[]): number {
  return drinks.reduce((previous, drink) => {
    return (
      (previous +
        drink.consumptions.reduce((previousVolume, consumption) => {
          if (consumption.endTime === undefined) {
            return previousVolume;
          }
          return previousVolume + consumption.volume;
        }, 0)) *
      (drink.alcohol / 100) *
      ALCOHOL_DENSITY
    );
  }, 0);
}
