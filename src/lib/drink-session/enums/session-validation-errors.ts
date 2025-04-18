export const SessionValidationErrors = {
  NO_DRINKS: 'NO_DRINKS',
  NO_CONSUMPTION: 'NO_CONSUMPTION',
  NOT_FINISHED_ALL_CONSUMPTIONS: 'NOT_FINISHED_ALL_CONSUMPTIONS',
} as const;

export type SessionValidationError =
  (typeof SessionValidationErrors)[keyof typeof SessionValidationErrors];
