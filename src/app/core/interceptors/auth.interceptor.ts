import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
  timeout,
} from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

const EXCLUDED_URLS = ['/api/auth/login', '/api/auth/register', '/api/Auth/Refresh'];

const REFRESH_TIMEOUT_MS = 10_000;

function isExcludedUrl(url: string): boolean {
  return EXCLUDED_URLS.some((excluded) => url.toLowerCase().endsWith(excluded.toLowerCase()));
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + 10_000;
  } catch {
    return true;
  }
}

function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handleRefresh(
  req: HttpRequest<unknown>,
  next: Parameters<HttpInterceptorFn>[1],
  authService: AuthService,
): Observable<HttpEvent<unknown>> {
  if (isRefreshing) {
    return refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => next(addAuthHeader(req, token))),
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  return authService.refresh().pipe(
    timeout(REFRESH_TIMEOUT_MS),
    switchMap((response) => {
      const newToken = response.jwt;
      isRefreshing = false;
      refreshTokenSubject.next(newToken);
      authService.storeToken(newToken);
      return next(addAuthHeader(req, newToken));
    }),
    catchError((error: unknown) => {
      isRefreshing = false;
      refreshTokenSubject.next(null);

      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.localLogout();
      }

      return throwError(() => error);
    }),
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (isExcludedUrl(req.url)) {
    return next(req);
  }

  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  // Check proattivo: se il token è già scaduto, refresh prima di inviare
  if (isTokenExpired(token)) {
    return handleRefresh(req, next, authService);
  }

  return next(addAuthHeader(req, token)).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleRefresh(req, next, authService);
      }
      return throwError(() => error);
    }),
  );
};
