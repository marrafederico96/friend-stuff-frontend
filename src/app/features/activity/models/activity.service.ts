export interface CreateActivityRequest {
  name: string;
  description?: string;
  type: ActivtyType;
  startDate: string;
  endDate: string;
}

enum ActivtyType {
  Social,
  Sport,
  Game,
  Other,
}
