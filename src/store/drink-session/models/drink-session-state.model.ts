import type { Drink } from './drink.model';

export interface ActiveDrinkSessionModel {
  status: 'active';
  name: string;
  startTime: number;
  drinks: Record<string, Drink>;
}

export interface InactiveDrinkSessionModel {
  status: 'inactive';
}

export type DrinkSessionState = ActiveDrinkSessionModel | InactiveDrinkSessionModel;

export const initialDrinkSessionState = {
  status: 'inactive',
} satisfies DrinkSessionState as DrinkSessionState;
