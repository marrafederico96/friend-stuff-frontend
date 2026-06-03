import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivityComponent } from '../../features/activity/components/activity.component';
import { ActivityService } from '../../features/activity/services/activity.service';
import { RouterLink } from '@angular/router';
import { UserActivitiesResponse } from '../../features/activity/models/activity.model';

//Material component
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private activtyService = inject(ActivityService);

  userActivities = computed(() => this.activtyService.userActivities());
  isLoading = signal<string>('');
  isMyActivitiesLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.isMyActivitiesLoading.set(true);
    this.activtyService.getUserActivities().subscribe({
      next: () => {
        this.isMyActivitiesLoading.set(false);
      },
    });
  }

  delete(publicActivityId: string) {
    this.isLoading.set(publicActivityId);
    this.activtyService.delete(publicActivityId).subscribe({
      next: () => {
        this.isLoading.set('');
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ActivityComponent, {
      height: '500px',
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
  }
}
