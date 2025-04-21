export interface EventData {
  year: string;
  description: string;
}

export interface EventsData {
  historisk: EventData[];
  births: EventData[];
  deaths: EventData[];
  description: string;
}
