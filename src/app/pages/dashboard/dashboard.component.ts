import { Component, inject } from '@angular/core';

//Material component
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivityComponent } from '../../features/activity/components/activity.component';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(ActivityComponent, {
      height: '400px',
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
  }
}
