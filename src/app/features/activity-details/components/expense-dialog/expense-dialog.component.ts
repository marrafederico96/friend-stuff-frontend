import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

//Material component
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ApiError } from '../../../../core/models/result.model';
import { CreateExpenseRequest } from '../../models/activity-details.model';
import { ActivityDetailsService } from '../../services/activity-details.service';

@Component({
  selector: 'app-expense-dialog',
  imports: [
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './expense-dialog.component.html',
  styleUrl: './expense-dialog.component.scss',
})
export class ExpenseDialog {
  private formBuilder = inject(FormBuilder);
  private activityDetailsService = inject(ActivityDetailsService);
  private activatedRoute = inject(ActivatedRoute);

  readonly dialogRef = inject(MatDialogRef<ExpenseDialog>);

  isLoading = signal<boolean>(false);
  error = signal<ApiError | null>(null);

  expenseForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    amount: [0, Validators.required],
  });

  private activityPublicId = computed(
    () => this.activityDetailsService.activityDetails()?.activity.publicId,
  );

  onSubmit() {
    if (this.expenseForm.valid) {
      this.isLoading.set(true);
      var expenseData: CreateExpenseRequest = this.expenseForm.value;
      expenseData.activityPublicId = this.activityPublicId() ?? '';

      this.activityDetailsService.createExpense(expenseData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.error.set(null);
          this.dialogRef.close();
          this.expenseForm.reset();
          this.activityDetailsService.getActivityDetail(expenseData.activityPublicId).subscribe();
        },
        error: (response: HttpErrorResponse) => {
          var apiError = response.error;
          this.error.set(apiError);
          this.isLoading.set(false);
        },
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
