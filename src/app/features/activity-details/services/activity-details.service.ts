import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Result } from '../../../core/models/result.model';
import {
  CreateExpenseRequest,
  RemoveParicipantRequest,
  UserActivityDetailsResponse,
} from '../models/activity-details.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityDetailsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  activityDetails = signal<UserActivityDetailsResponse | undefined>(undefined);
  activityParticipants = signal<string[]>([]);

  getActivityDetail(publicActivityId: string): Observable<Result<UserActivityDetailsResponse>> {
    return this.http
      .get<
        Result<UserActivityDetailsResponse>
      >(`${this.apiUrl}/Activity/GetUserActivityDetails`, { params: { publicActivityId: publicActivityId } })
      .pipe(
        tap((response) => {
          this.activityDetails.set(response.value);
          this.getActivityParticipants(publicActivityId).subscribe();
        }),
      );
  }

  createExpense(expenseData: CreateExpenseRequest): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/Expense/Create`, expenseData);
  }

  deleteExpense(publicId: string): Observable<Result> {
    return this.http.delete<Result>(`${this.apiUrl}/Expense/Delete`, {
      params: {
        publicId: publicId,
      },
    });
  }

  removeParticipant(data: RemoveParicipantRequest): Observable<Result> {
    return this.http
      .delete<Result>(`${this.apiUrl}/Activity/RemoveParticipant`, { body: data })
      .pipe(
        tap(() => {
          this.getActivityParticipants(data.publicActivityId).subscribe();
        }),
      );
  }

  getActivityParticipants(publicId: string): Observable<Result<string[]>> {
    return this.http
      .get<Result<string[]>>(`${this.apiUrl}/Activity/GetActivityParticipants`, {
        params: { publicId: publicId },
      })
      .pipe(
        tap((response) => {
          if (response.value) {
            this.activityParticipants.set(response.value);
          }
        }),
      );
  }
}
