export const DrinkTypeEnum = {
  BEER: 'beer',
  RED_WINE: 'red-wine',
  WHITE_WINE: 'white-wine',
  CUSTOM: 'custom',
} as const;

export type DrinkType = (typeof DrinkTypeEnum)[keyof typeof DrinkTypeEnum];
