import z from 'zod';

const DrinkSessionPreferencesSchema = z.object({
  reminders: z.boolean().default(true),
});

export const notificationPreferencesSchema = z.preprocess(
  (value) => {
    const valueType = typeof value;
    if (!value) {
      console.warn(`Unexpected value type: ${valueType}: ${value}`);
      return {};
    }

    switch (valueType) {
      case 'object':
        return Array.isArray(value) ? {} : value;
      case 'string': {
        try {
          return JSON.parse(value as string);
        } catch (error) {
          console.error(`Failed to parse JSON string: ${value}`);
          return {};
        }
      }
      default: {
        console.warn(`Unexpected value type: ${valueType}: ${value.toString()}`);
        return {};
      }
    }
  },
  z.object({
    drinkSession: DrinkSessionPreferencesSchema.default({ reminders: true }),
  })
);

export type NotificationPreferencesModel = z.infer<typeof notificationPreferencesSchema>;

export const defaultNotificationPreferences: NotificationPreferencesModel =
  notificationPreferencesSchema.safeParse({}).data!;
