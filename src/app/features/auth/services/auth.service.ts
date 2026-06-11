import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Result } from '../../../core/models/result.model';
import { LoginRequest, RegisterRequest, TokenDecoded, TokenResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  isAuthenticated = signal<boolean>(false);
  tokenDecoded = signal<TokenDecoded | undefined>(undefined);

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
    this.isAuthenticated.set(false);
    this.tokenDecoded.set(undefined);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  storeToken(token: string): void {
    localStorage.setItem('token', token);
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
      this.tokenDecoded.set(jwtDecode(token));
    } else {
      this.isAuthenticated.set(false);
      this.tokenDecoded.set(undefined);
    }
  }
}
