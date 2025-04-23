import type { DrinkModel } from '@drinkweise/store/drink-session/models/drink.model';

import {
  type SessionValidationError,
  SessionValidationErrors,
} from './enums/session-validation-errors';

type SessionValidationResult =
  | { error: typeof SessionValidationErrors.NO_DRINKS; drink?: undefined }
  | { error: SessionValidationError; drink: DrinkModel }
  | null;

export function validateSessionCompletion(drinks: DrinkModel[]): SessionValidationResult {
  if (drinks.length === 0) {
    return { error: SessionValidationErrors.NO_DRINKS };
  }

  for (const drink of drinks) {
    if (drink.consumptions.length === 0) {
      return { error: SessionValidationErrors.NO_CONSUMPTION, drink };
    }

    if (drink.consumptions.some((consumption) => consumption.endTime === undefined)) {
      return {
        error: SessionValidationErrors.NOT_FINISHED_ALL_CONSUMPTIONS,
        drink,
      };
    }
  }

  return null;
}
