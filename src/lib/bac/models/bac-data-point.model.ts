// Record<string, unknown> is needed for the victory graph
export interface BACDataPoint extends Record<string, unknown> {
  bloodAlcoholContent: number;
  time: number;
}
