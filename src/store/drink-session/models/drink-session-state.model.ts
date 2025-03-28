export interface ActiveDrinkSessionModel {
  status: 'active';
}

export interface InactiveDrinkSessionModel {
  status: 'inactive';
}

export type DrinkSessionState = ActiveDrinkSessionModel | InactiveDrinkSessionModel;

export const initialDrinkSessionState = {
  status: 'inactive',
} satisfies DrinkSessionState as DrinkSessionState;
