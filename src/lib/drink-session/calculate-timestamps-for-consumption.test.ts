import {
  calculateEndTimeForConsumption,
  calculateStartTimeForConsumption,
} from './calculate-timestamps-for-consumption';

describe('lib', () => {
  describe('drink-session', () => {
    describe.each(['CET', 'UTC', 'America/New_York', 'America/Los_Angeles'] as const)(
      'calculate-timestamps-for-consumption with timezone %s',
      (timezone) => {
        beforeAll(() => {
          process.env.TZ = timezone;
        });
        afterAll(() => {
          delete process.env.TZ;
        });
        describe('calculateStartTimeForConsumption', () => {
          it.each([
            {
              currentStartDate: new Date('2023-10-01T12:00:00Z'),
              selectedStartDate: new Date('2023-10-01T13:00:00Z'),
            },
            {
              currentStartDate: new Date('2023-10-01T12:00:00Z'),
              selectedStartDate: new Date('2023-10-01T11:00:00Z'),
            },
            {
              currentStartDate: new Date('2023-10-01T12:00:00Z'),
              selectedStartDate: new Date('2023-10-01T12:00:00Z'),
            },
            {
              currentStartDate: new Date('2023-10-01T23:00:00Z'),
              selectedStartDate: new Date('2023-10-01T23:30:00Z'),
            },
            {
              currentStartDate: new Date('2023-10-01T00:30:00Z'),
              selectedStartDate: new Date('2023-10-01T1:30:00Z'),
            },
          ])(
            'should use the selected start time $selectedStartDate when  the current start date is $currentStartDate',
            ({ currentStartDate, selectedStartDate }) => {
              const result = calculateStartTimeForConsumption(
                selectedStartDate.getTime(),
                currentStartDate.getTime()
              );
              expect(result.startTime).toBe(selectedStartDate.getTime());
              expect(result.endTime).toBeUndefined();
            }
          );

          it('should not update the end time if the selected start time is before the current start time', () => {
            const currentStartDate = new Date('2023-10-01T12:00:00Z');
            const selectedStartDate = new Date('2023-10-01T11:00:00Z');
            const currentEndDate = new Date('2023-10-01T13:00:00Z');
            const result = calculateStartTimeForConsumption(
              selectedStartDate.getTime(),
              currentStartDate.getTime(),
              currentEndDate.getTime()
            );
            expect(result.startTime).toBe(selectedStartDate.getTime());
            expect(result.endTime).toBe(currentEndDate.getTime());
          });

          it('should not update the end time if the selected start time is the same as the current start time', () => {
            const currentStartDate = new Date('2023-10-01T12:00:00Z');
            const selectedStartDate = new Date('2023-10-01T12:00:00Z');
            const currentEndDate = new Date('2023-10-01T13:00:00Z');
            const result = calculateStartTimeForConsumption(
              selectedStartDate.getTime(),
              currentStartDate.getTime(),
              currentEndDate.getTime()
            );
            expect(result.startTime).toBe(currentStartDate.getTime());
            expect(result.endTime).toBe(currentEndDate.getTime());
          });

          it('should add a day to the end time when the start time is after the end time', () => {
            const currentStartDate = new Date('2023-10-01T12:00:00Z');
            const selectedStartDate = new Date('2023-10-01T15:00:00Z');
            const currentEndDate = new Date('2023-10-01T14:00:00Z');
            const expectedEndDate = new Date('2023-10-02T14:00:00Z');
            const result = calculateStartTimeForConsumption(
              selectedStartDate.getTime(),
              currentStartDate.getTime(),
              currentEndDate.getTime()
            );
            expect(result.startTime).toBe(selectedStartDate.getTime());
            expect(result.endTime).toBe(expectedEndDate.getTime());
          });
        });

        describe('calculateEndTimeForConsumption', () => {
          it('should overflow to the next day when the end time is before the start time', () => {
            const currentStartDate = new Date('2023-10-01T23:00:00Z');
            const currentEndDate = new Date('2023-10-01T23:30:00Z');
            const selectedEndDate = new Date('2023-10-01T01:00:00Z');
            const expectedEndDate = new Date('2023-10-02T01:00:00Z');

            expect(
              calculateEndTimeForConsumption(
                selectedEndDate.getTime(),
                currentEndDate.getTime(),
                currentStartDate.getTime()
              )
            ).toBe(expectedEndDate.getTime());
          });

          it('should not overflow to the next day when the end time is after the start time', () => {
            const currentStartDate = new Date('2023-10-01T20:00:00Z');
            const currentEndDate = new Date('2023-10-01T22:00:00Z');
            const selectedEndDate = new Date('2023-10-01T23:00:00Z');

            expect(
              calculateEndTimeForConsumption(
                selectedEndDate.getTime(),
                currentEndDate.getTime(),
                currentStartDate.getTime()
              )
            ).toBe(selectedEndDate.getTime());
          });

          it('should not overflow to the next day when the end time is the same as the start time', () => {
            const currentStartDate = new Date(2023, 9, 1, 20, 0, 0);
            const currentEndDate = new Date(2023, 9, 1, 22, 0, 0);
            const selectedEndDate = new Date(2023, 9, 1, 20, 0, 0);

            expect(
              calculateEndTimeForConsumption(
                selectedEndDate.getTime(),
                currentEndDate.getTime(),
                currentStartDate.getTime()
              )
            ).toBe(selectedEndDate.getTime());
          });

          it('should not remove a day when the selected end time is smaller than the current end', () => {
            const currentStartDate = new Date(2023, 9, 1, 20, 0, 0);
            const currentEndDate = new Date(2023, 9, 2, 22, 0, 0);
            const selectedEndDate = new Date(2023, 9, 2, 19, 0, 0);
            const expectedEndDate = new Date(2023, 9, 2, 19, 0, 0);

            expect(
              calculateEndTimeForConsumption(
                selectedEndDate.getTime(),
                currentEndDate.getTime(),
                currentStartDate.getTime()
              )
            ).toBe(expectedEndDate.getTime());
          });

          it('should remove a day when the selected end time is smaller than the current end and it was between 18 and 6', () => {
            const currentStartDate = new Date(2023, 9, 1, 20, 0, 0);
            const currentEndDate = new Date(2023, 9, 2, 1, 0, 0);
            const selectedEndDate = new Date(2023, 9, 2, 23, 0, 0);
            const expectedEndDate = new Date(2023, 9, 1, 23, 0, 0);

            expect(
              calculateEndTimeForConsumption(
                selectedEndDate.getTime(),
                currentEndDate.getTime(),
                currentStartDate.getTime()
              )
            ).toBe(expectedEndDate.getTime());
          });

          it('should reset to start date when overflow date is less then start date', () => {
            const currentStartDate = new Date(2023, 9, 1, 20, 0, 0);
            const currentEndDate = new Date(2023, 9, 2, 1, 0, 0);
            const selectedEndDate = new Date(2023, 9, 2, 19, 0, 0);

            expect(
              calculateEndTimeForConsumption(
                selectedEndDate.getTime(),
                currentEndDate.getTime(),
                currentStartDate.getTime()
              )
            ).toBe(currentStartDate.getTime());
          });
        });
      }
    );
  });
});
