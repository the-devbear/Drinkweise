import { isValidBarcode } from '@drinkweise/lib/utils/barcode/is-valid-barcode';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

export const filterDrinksRule = (drinks: AddDrinkModel[], searchString: string) => {
  const trimmedSearchString = searchString.trim();
  if (!trimmedSearchString) {
    return drinks;
  }

  if (isValidBarcode(trimmedSearchString)) {
    return drinks.filter((drink) => drink.barcodes.includes(trimmedSearchString));
  }

  const lowerCaseSearchString = trimmedSearchString.toLowerCase();
  return drinks.filter((drink) => drink.name.toLowerCase().includes(lowerCaseSearchString));
};
