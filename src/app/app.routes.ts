import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ActivityDetailsComponent } from './features/activity-details/components/activity-details/activity-details.component';
import { AuthComponent } from './features/auth/components/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'auth/login', component: AuthComponent },
  { path: 'auth/register', component: AuthComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  {
    path: 'activity/:publicActivityId',
    component: ActivityDetailsComponent,
    canActivate: [authGuard],
  },
];
