export interface DrinkSessionResponse {
  id: string;
  name: string;
  note?: string;
  startTime: string;
  endTime: string;
  user: {
    userName: string;
    profilePictureUrl?: string;
  };
  consumptions: {
    id: number;
    name: string;
    type: string;
    alcohol: number;
    volume: number;
    startTime: string;
    endTime: string;
  }[];
}
