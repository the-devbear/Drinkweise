import { z } from 'zod';

export const exportedNotificationPreferencesSchema = z
  .object({
    drinkSession: z.object({
      reminders: z.boolean(),
    }),
  })
  .optional();

export const exportedUserSchema = z.object({
  id: z.uuidv4(),
  username: z.string().min(1),
  height: z.number().positive(),
  weight: z.number().positive(),
  gender: z.string().optional(),
  createdAt: z.iso.datetime(),
  notificationPreferences: exportedNotificationPreferencesSchema,
});

export const exportedConsumptionSchema = z.object({
  id: z.number().int().positive(),
  drinkName: z.string().min(1),
  drinkType: z.string(),
  alcoholPercentage: z.number().min(0).max(100),
  volume: z.number().positive(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
});

export const exportedDrinkSessionSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(1),
  note: z.string().optional(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  consumptions: z.array(exportedConsumptionSchema),
});

export const exportedStatisticsSchema = z.object({
  totalSessions: z.number().int().nonnegative(),
  totalConsumptions: z.number().int().nonnegative(),
  totalAlcoholConsumed: z.number().nonnegative(),
});

export const exportedUserDataV1Schema = z.object({
  exportDate: z.iso.datetime(),
  version: z.literal('1.0.0'),
  user: exportedUserSchema,
  drinkSessions: z.array(exportedDrinkSessionSchema),
  statistics: exportedStatisticsSchema,
});

export type ExportedUserDataV1 = z.infer<typeof exportedUserDataV1Schema>;
export type ExportedUser = z.infer<typeof exportedUserSchema>;
export type ExportedDrinkSession = z.infer<typeof exportedDrinkSessionSchema>;
export type ExportedConsumption = z.infer<typeof exportedConsumptionSchema>;
export type ExportedStatistics = z.infer<typeof exportedStatisticsSchema>;

export function validateExportDataV1(data: unknown): ExportedUserDataV1 {
  return exportedUserDataV1Schema.parse(data);
}

export function safeValidateExportDataV1(data: unknown) {
  return exportedUserDataV1Schema.safeParse(data);
}
