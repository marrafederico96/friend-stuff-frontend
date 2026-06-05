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
import { AuthService } from '../../../auth/services/auth.service';
import { ExpenseParticipantDialogComponent } from '../../expense-participant-dialog/expense-participant-dialog.component';
import {
  RemoveExpenseParicipantRequest,
  RemoveParicipantRequest,
} from '../../models/activity-details.model';
import { ParticipantDialogComponent } from '../../participant-dialog/participant-dialog.component';
import { ActivityDetailsService } from '../../services/activity-details.service';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';

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
  private authService = inject(AuthService);

  readonly dialog = inject(MatDialog);

  activityDetails = computed(() => this.activityDetailsService.activityDetails());
  activityParticpants = computed(() => this.activityDetailsService.activityParticipants());
  loggedUsername = computed(() => this.authService.tokenDecoded()?.name);
  activityPublicId: string = '';
  isLoading = signal<string>('');
  isParticipantRemove = signal<string>('');
  isExpenseParticipantRemove = signal<string>('');

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

  openExpenseParticipantDialog(expenseId: string, payerUsername: string): void {
    const dialogRef = this.dialog.open(ExpenseParticipantDialogComponent, {
      height: '400px',
      width: '400px',
      autoFocus: true,
      disableClose: true,
      data: { expenseId: expenseId, payerUsername: payerUsername },
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

  removeExpenseParticipant(expenseParticipant: string, expenseId: string) {
    this.isExpenseParticipantRemove.set(expenseParticipant);

    const data: RemoveExpenseParicipantRequest = {
      expensePublicId: expenseId,
      username: expenseParticipant,
    };

    this.activityDetailsService.removeExpenseParticipant(data).subscribe({
      next: () => {
        this.isExpenseParticipantRemove.set('');
        this.activityDetailsService.getActivityDetail(this.activityPublicId).subscribe();
      },
      error: () => {
        this.isExpenseParticipantRemove.set('');
      },
    });
  }
}
