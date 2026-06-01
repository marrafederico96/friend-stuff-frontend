import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['auth/login', 'auth/register'];
  const authService = inject(AuthService);
  const isExcluded = excludedUrls.some((url) => req.url.includes(url));

  if (isExcluded) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return authService.refresh().pipe(
            switchMap((response) => {
              const token = response.jwt;
              localStorage.setItem('token', token);
              const newReq = clonedReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              });
              return next(newReq).pipe(
                catchError((error: HttpErrorResponse) => {
                  authService.localLogout();
                  return throwError(() => error);
                }),
              );
            }),
          );
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
};
