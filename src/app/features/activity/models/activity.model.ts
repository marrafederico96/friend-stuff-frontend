export interface CreateActivityRequest {
  name: string;
  description?: string;
  type: ActivtyType;
  startDate: string;
  endDate: string;
}

export interface UserActivitiesResponse {
  publicId: string;
  name: string;
  description?: string;
  type: string;
  startDate: string;
  endDate: string;
}

enum ActivtyType {
  Social,
  Sport,
  Game,
  Other,
}
