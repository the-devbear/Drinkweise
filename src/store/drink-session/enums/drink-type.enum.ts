export const DrinkTypeEnum = {
  BEER: 'beer',
  RED_WINE: 'red-wine',
  WHITE_WINE: 'white-wine',
  SPIRIT: 'spirit',
  OTHER: 'other',
} as const;

export type DrinkType = (typeof DrinkTypeEnum)[keyof typeof DrinkTypeEnum];
