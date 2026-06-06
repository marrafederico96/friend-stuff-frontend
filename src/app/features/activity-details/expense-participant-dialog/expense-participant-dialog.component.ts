import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipListbox, MatChipListboxChange, MatChipOption, MatChip } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ApiError } from '../../../core/models/result.model';
import { AddExpenseParticipantRequest } from '../models/activity-details.model';
import { ActivityDetailsService } from '../services/activity-details.service';

@Component({
  selector: 'app-expense-participant-dialog',
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatError,
    MatDialogActions,
    MatProgressSpinner,
    MatChipListbox,
    MatChipOption,
    MatChip
],
  templateUrl: './expense-participant-dialog.component.html',
  styleUrl: './expense-participant-dialog.component.scss',
})
export class ExpenseParticipantDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ExpenseParticipantDialogComponent>);
  private activityDetailsService = inject(ActivityDetailsService);
  private formBuilder = inject(FormBuilder);

  private expenseData = inject<{ expenseId: string; payerUsername: string }>(MAT_DIALOG_DATA);

  activityParticipants = computed(() => {
    const allParticipants = this.activityDetailsService.activityParticipants();
    const details = this.activityDetailsService.activityDetails();

    const currentExpense = details?.expenses?.find(
      (e) => e.expensePublicId === this.expenseData.expenseId,
    );

    if (!currentExpense) {
      return allParticipants;
    }

    const alreadyAdded = new Set([
      this.expenseData.payerUsername,
      ...(currentExpense.participants?.map((p) => p) ?? []),
    ]);

    return allParticipants.filter((username) => !alreadyAdded.has(username));
  });

  expenseParticipantForm: FormGroup = this.formBuilder.group({
    usernames: [[]],
  });

  error = signal<ApiError | undefined>(undefined);
  isLoading = signal<boolean>(false);

  get usernamesValue(): string[] {
    return this.expenseParticipantForm.get('usernames')?.value || [];
  }

  close() {
    this.dialogRef.close();
  }

  onSelectionChange(event: MatChipListboxChange) {
    const selectedUsernames = event.source.value as string[];

    this.expenseParticipantForm.patchValue({
      usernames: selectedUsernames,
    });
  }

  onSubmit() {
    if (this.expenseParticipantForm.valid && this.usernamesValue.length > 0) {
      this.isLoading.set(true);

      const data: AddExpenseParticipantRequest = {
        usernames: this.usernamesValue,
        publicExpenseId: this.expenseData.expenseId,
        publicActivityId: this.activityDetailsService.activityDetails()?.activity.publicId || '',
      };

      this.activityDetailsService.addExpenseParticipant(data).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.dialogRef.close(true); // Chiude il dialog con successo
        },
        error: (response: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.error.set(response.error);
        },
      });
    }
  }
}
