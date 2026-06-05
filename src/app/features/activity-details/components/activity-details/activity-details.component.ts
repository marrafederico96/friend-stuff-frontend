import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';

// Material component
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ActivityDetailsService } from '../../services/activity-details.service';
import { ExpenseDialog } from '../expense-dialog/expense-dialog.component';

@Component({
  selector: 'app-activity-details',
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent implements OnInit {
  private activityDetailsService = inject(ActivityDetailsService);
  private activatedRoute = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);

  activityDetails = computed(() => this.activityDetailsService.activityDetails());

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (data) => {
        this.activityDetailsService.getActivityDetail(data['publicActivityId']).subscribe();
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ExpenseDialog, {
      height: '500px',
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
  }
}
