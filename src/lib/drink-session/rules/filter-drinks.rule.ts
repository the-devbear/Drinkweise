import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

export const filterDrinksRule = (drinks: AddDrinkModel[], searchString: string) => {
  if (!searchString) {
    return drinks;
  }

  const lowerCaseSearchString = searchString.trim().toLowerCase();
  return drinks.filter((drink) => drink.name.toLowerCase().includes(lowerCaseSearchString));
};
