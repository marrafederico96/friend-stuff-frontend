import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Result } from '../../../core/models/result.model';
import {
  ActivityTypes,
  CreateActivityRequest,
  UserActivityResponse,
} from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  userActivities = signal<UserActivityResponse[]>([]);

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

  getUserActivities(): Observable<Result<UserActivityResponse[]>> {
    return this.http
      .get<Result<UserActivityResponse[]>>(`${this.apiUrl}/Activity/GetUserActivities`)
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
