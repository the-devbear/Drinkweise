import {
  defaultNotificationPreferences,
  notificationPreferencesSchema,
} from '../notification-preferences.model';

describe('store', () => {
  describe('user', () => {
    describe('models', () => {
      describe('notification-preferences', () => {
        let warnSpy: jest.SpyInstance;
        beforeEach(() => {
          warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it.each([undefined, null, 1, true, false, Symbol('x'), BigInt(1), () => {}, NaN])(
          'should still parse when value is %p and log a warning',
          (value) => {
            expect(notificationPreferencesSchema.parse(value)).toEqual(
              defaultNotificationPreferences
            );
            expect(warnSpy).toHaveBeenCalled();
          }
        );

        it('should still parse when an array is provided', () => {
          const parsed = notificationPreferencesSchema.parse([]);
          expect(parsed).toEqual(defaultNotificationPreferences);
        });

        it('should still parse when an object is provided', () => {
          const parsed = notificationPreferencesSchema.parse({});
          expect(parsed).toEqual(defaultNotificationPreferences);
        });

        it('should still parse when an object with drinkSession is provided', () => {
          const parsed = notificationPreferencesSchema.parse({ drinkSession: {} });
          expect(parsed).toEqual(defaultNotificationPreferences);
        });

        it('should still parse when an object with more properties', () => {
          const parsed = notificationPreferencesSchema.parse({ drinkSession: {}, social: {} });
          expect(parsed).toEqual(defaultNotificationPreferences);
        });

        it('should not overwrite existing properties', () => {
          const parsed = notificationPreferencesSchema.parse({
            drinkSession: { reminders: false },
          });
          expect(parsed).toEqual({ drinkSession: { reminders: false } });
        });

        it('should log an error when an invalid json string is provided', () => {
          const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
          const parsed = notificationPreferencesSchema.parse('{ "drinkSession"');

          expect(parsed).toEqual(defaultNotificationPreferences);
          expect(errorSpy).toHaveBeenCalled();
        });

        it('should parse json string correctly', () => {
          const parsed = notificationPreferencesSchema.parse(
            '{"drinkSession": {"reminders": false}}'
          );
          expect(parsed).toEqual({ drinkSession: { reminders: false } });
        });

        it('should return error when an invalid property is provided', () => {
          const parsed = notificationPreferencesSchema.safeParse({
            drinkSession: 'someValue',
          });
          expect(parsed.success).toBe(false);
          expect(parsed.error).toBeDefined();
        });

        it('should have the correct default value', () => {
          expect(defaultNotificationPreferences).toEqual({
            drinkSession: {
              reminders: true,
            },
          });
        });
      });
    });
  });
});
