import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/components/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { ActivityComponent } from './pages/activity/activity.component';

export const routes: Routes = [
  { path: 'auth/login', component: AuthComponent },
  { path: 'auth/register', component: AuthComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'activity/:publicActivityId', component: ActivityComponent, canActivate: [authGuard] },
];
