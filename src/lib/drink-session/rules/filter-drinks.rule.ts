import { isValidBarcode } from '@drinkweise/lib/utils/barcode/is-valid-barcode';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

export const filterDrinksRule = (drinks: AddDrinkModel[], searchString: string) => {
  if (!searchString) {
    return drinks;
  }

  const trimmedSearchString = searchString.trim();

  // If it's a valid barcode, search by exact barcode match
  if (isValidBarcode(trimmedSearchString)) {
    return drinks.filter((drink) => drink.barcode === trimmedSearchString);
  }

  // Otherwise search by name (case insensitive)
  const lowerCaseSearchString = trimmedSearchString.toLowerCase();
  return drinks.filter((drink) => drink.name.toLowerCase().includes(lowerCaseSearchString));
};
