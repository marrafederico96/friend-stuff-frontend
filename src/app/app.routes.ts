import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/component/auth.component';

export const routes: Routes = [
  { path: 'auth/login', component: AuthComponent },
  { path: 'auth/register', component: AuthComponent },
];
