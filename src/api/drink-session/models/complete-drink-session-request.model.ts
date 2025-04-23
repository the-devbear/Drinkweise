export interface CompleteDrinkSessionRequestModel {
  name: string;
  note?: string;
  startTime: Date;
  endTime: Date;
  consumptions: {
    drinkId: string;
    volume: number;
    startTime: Date;
    endTime: Date;
  }[];
}
