import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['auth/login', 'auth/register'];

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
    return next(clonedReq);
  }

  return next(req);
};
