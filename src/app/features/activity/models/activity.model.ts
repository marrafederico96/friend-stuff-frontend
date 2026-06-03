export interface CreateActivityRequest {
  name: string;
  description?: string;
  type: string;
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

export interface ActivityTypes {
  publicId: string;
  name: string;
  normalizedName: string;
}
