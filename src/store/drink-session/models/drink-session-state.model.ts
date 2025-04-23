import type { DrinkModel } from './drink.model';

export interface ActiveDrinkSessionModel {
  status: 'active';
  name: string;
  note: string;
  startTime: number;
  drinks: DrinkModel[];
}

export interface InactiveDrinkSessionModel {
  status: 'inactive';
}

export type DrinkSessionState = ActiveDrinkSessionModel | InactiveDrinkSessionModel;

export const initialDrinkSessionState = {
  status: 'inactive',
} satisfies DrinkSessionState as DrinkSessionState;
