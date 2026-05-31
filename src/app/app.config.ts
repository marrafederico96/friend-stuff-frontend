import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { AuthService } from './features/auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAppInitializer(() => {
      var auth = inject(AuthService);
      auth.checkAuthState();
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
