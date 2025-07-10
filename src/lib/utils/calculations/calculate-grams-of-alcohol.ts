const ALCOHOL_DENSITY = 0.8;

export function calculateGramsOfAlcohol(volume: number, alcoholPercentage: number): number {
  if (volume <= 0 || alcoholPercentage < 0) {
    return 0;
  }

  return volume * (alcoholPercentage / 100) * ALCOHOL_DENSITY;
}
