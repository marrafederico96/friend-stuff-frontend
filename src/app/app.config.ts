import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { AuthService } from './features/auth/services/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      var auth = inject(AuthService);
      auth.checkAuthState();
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
