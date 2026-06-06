import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Result } from '../../../core/models/result.model';
import { BalanceResponse } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  balanceInfo = signal<BalanceResponse[]>([]);
  personalBalance = signal<number>(0);

  getBalance(): Observable<Result<BalanceResponse[]>> {
    return this.http.get<Result<BalanceResponse[]>>(`${this.apiUrl}/User/Balance`).pipe(
      tap((response) => {
        if (response.value) {
          this.balanceInfo.set(response.value);
        }
      }),
    );
  }

  getPersonalBalance(): Observable<Result<number>> {
    return this.http.get<Result<number>>(`${this.apiUrl}/User/PersonalBalance`).pipe(
      tap((response) => {
        if (response.value) {
          this.personalBalance.set(response.value);
        }
      }),
    );
  }
}
