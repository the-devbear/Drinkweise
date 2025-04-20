export function calculateSoberTime(
  totalAlcoholConsumed: number,
  weight: number = 70,
  startTime: number = Date.now()
) {
  const reduceAlcoholPerHour = 0.1 * weight;

  const totalTimeFromStartInMinutes = (totalAlcoholConsumed / reduceAlcoholPerHour) * 60;
  const totalTimeFromNowInMinutes = totalTimeFromStartInMinutes - (Date.now() - startTime) / 60_000;

  if (totalTimeFromNowInMinutes < 0) {
    return 'Already sober';
  }

  return new Date(Date.now() + totalTimeFromNowInMinutes * 60_000);
}
