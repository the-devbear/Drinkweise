import z from 'zod';

const DrinkSessionPreferencesSchema = z.object({
  reminders: z.boolean().default(true),
});

export const notificationPreferencesSchema = z.object({
  drinkSession: DrinkSessionPreferencesSchema.default({ reminders: true }),
});

export type NotificationPreferencesModel = z.infer<typeof notificationPreferencesSchema>;

export const defaultNotificationPreferences: NotificationPreferencesModel =
  notificationPreferencesSchema.safeParse({}).data!;
