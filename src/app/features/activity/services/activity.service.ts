import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  ActivityTypes,
  CreateActivityRequest,
  UserActivitiesResponse,
} from '../models/activity.model';
import { Observable, tap } from 'rxjs';
import { Result } from '../../../core/models/result.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  userActivities = signal<UserActivitiesResponse[]>([]);

  create(data: CreateActivityRequest): Observable<Result> {
    return this.http
      .post<Result>(`${this.apiUrl}/Activity/Create`, data)
      .pipe(tap(() => this.getUserActivities().subscribe()));
  }

  delete(publicActivityId: string): Observable<Result> {
    return this.http
      .delete<Result>(`${this.apiUrl}/Activity/Delete`, {
        params: {
          publicActivityId: publicActivityId,
        },
      })
      .pipe(tap(() => this.getUserActivities().subscribe()));
  }

  getUserActivities(): Observable<Result<UserActivitiesResponse[]>> {
    return this.http
      .get<Result<UserActivitiesResponse[]>>(`${this.apiUrl}/Activity/GetUserActivities`)
      .pipe(
        tap((response) => {
          this.userActivities.set(response.value ?? []);
        }),
      );
  }

  getActivityTypes(): Observable<Result<ActivityTypes[]>> {
    return this.http.get<Result<ActivityTypes[]>>(`${this.apiUrl}/Activity/GetActivityTypes`);
  }
}
