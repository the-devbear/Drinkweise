export function isSameDay(startTimeStamp: number, endTimeStamp: number) {
  return (
    new Date(startTimeStamp).setHours(0, 0, 0, 0) === new Date(endTimeStamp).setHours(0, 0, 0, 0)
  );
}
