import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Result } from '../../../core/models/result.model';
import {
  CreateExpenseRequest,
  UserActivityDetailsResponse,
} from '../models/activity-details.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityDetailsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  activityDetails = signal<UserActivityDetailsResponse | undefined>(undefined);

  getActivityDetail(publicActivityId: string): Observable<Result<UserActivityDetailsResponse>> {
    return this.http
      .get<
        Result<UserActivityDetailsResponse>
      >(`${this.apiUrl}/Activity/GetUserActivityDetails`, { params: { publicActivityId: publicActivityId } })
      .pipe(
        tap((response) => {
          this.activityDetails.set(response.value);
        }),
      );
  }

  createExpense(expenseData: CreateExpenseRequest): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/Expense/Create`, expenseData);
  }
}
