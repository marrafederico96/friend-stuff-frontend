import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoginRequest, RegisterRequest, TokenResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { Result } from '../../../core/models/result.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  isAuthenticated = signal<boolean>(false);

  register(data: RegisterRequest): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/Auth/Register`, data);
  }

  login(data: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.apiUrl}/Auth/Login`, data, { withCredentials: true })
      .pipe(
        tap((response) => {
          var token = response.jwt;
          if (token) {
            localStorage.setItem('token', token);
            this.checkAuthState();
          }
        }),
      );
  }

  logout(): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/Auth/Logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.checkAuthState();
      }),
    );
  }

  localLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['auth/login']);
  }

  refresh(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.apiUrl}/Auth/Refresh`,
      {},
      { withCredentials: true },
    );
  }

  checkAuthState() {
    var token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated.set(true);
    } else {
      this.isAuthenticated.set(false);
    }
  }
}
