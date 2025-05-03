export interface DrinkSessionResponse {
  id: string;
  name: string;
  note?: string | null;
  userName: string;
  startTime: Date;
  endTime: Date;
}
