/**
 * 60 * 1000 = 60 seconds in a minute
 */
const MINUTE_IN_MILLISECONDS = 60_000;
/**
 *  3600 * 1000 = 3600 seconds in an hour
 */
const HOUR_IN_MILLISECONDS = 3_600_000;
/**
 * 24 * 3600 * 1000 = 24 hours in a day
 */
const DAY_IN_MILLISECONDS = 86_400_000;

export function calculateSessionDuration(startTime: number, endTime?: number): string {
  const currentTime = endTime ?? Date.now();
  const difference = currentTime - startTime;

  if (difference < HOUR_IN_MILLISECONDS) {
    const minutes = Math.floor(difference / MINUTE_IN_MILLISECONDS);
    const seconds = Math.floor((difference - minutes * MINUTE_IN_MILLISECONDS) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
  }

  if (difference < DAY_IN_MILLISECONDS) {
    const hours = Math.floor(difference / HOUR_IN_MILLISECONDS);
    const minutes = Math.floor(
      (difference - hours * HOUR_IN_MILLISECONDS) / MINUTE_IN_MILLISECONDS
    );
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} h`;
  }

  const days = Math.floor(difference / DAY_IN_MILLISECONDS);
  return `${days} day${days > 1 ? 's' : ''}`;
}
