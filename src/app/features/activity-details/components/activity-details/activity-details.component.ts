import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

// Material component
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipSet, MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { RemoveParicipantRequest } from '../../models/activity-details.model';
import { ActivityDetailsService } from '../../services/activity-details.service';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { ParticipantDialogComponent } from '../participant-dialog/participant-dialog.component';

@Component({
  selector: 'app-activity-details',
  imports: [
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipSet,
  ],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent implements OnInit {
  private activityDetailsService = inject(ActivityDetailsService);
  private activatedRoute = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);

  activityDetails = computed(() => this.activityDetailsService.activityDetails());
  activityParticpants = computed(() => this.activityDetailsService.activityParticipants());
  activityPublicId: string = '';
  isLoading = signal<string>('');
  isParticipantRemove = signal<string>('');

  totalExpense = computed(() => {
    var total: number = 0;

    this.activityDetails()?.expenses.forEach((e) => {
      total += e.amount;
    });
    return total;
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (data) => {
        this.activityPublicId = data['publicActivityId'];
        this.activityDetailsService.getActivityDetail(this.activityPublicId).subscribe();
        console.log(this.activityDetails());
      },
    });
  }

  delete(publicId: string) {
    this.isLoading.set(publicId);
    this.activityDetailsService.deleteExpense(publicId).subscribe({
      next: () => {
        this.activityDetailsService.getActivityDetail(this.activityPublicId).subscribe();
        this.isLoading.set('');
      },
    });
  }

  openExpenseDialog(): void {
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      height: '500px',
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
  }

  openParticipantDialog(): void {
    const dialogRef = this.dialog.open(ParticipantDialogComponent, {
      height: '400px',
      width: '400px',
      autoFocus: true,
      disableClose: true,
    });
  }

  removeParticipant(username: string) {
    this.isParticipantRemove.set(username);

    const data: RemoveParicipantRequest = {
      publicActivityId: this.activityPublicId,
      username: username,
    };

    this.activityDetailsService.removeParticipant(data).subscribe({
      next: () => {
        this.isParticipantRemove.set('');
      },
      error: () => {
        this.isParticipantRemove.set('');
      },
    });
  }
}
