import { Component, inject, signal, LOCALE_ID, Inject } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CreateActivityRequest } from '../models/activity.model';
import { HttpErrorResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';

//Material component
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ApiError } from '../../../core/models/result.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-activity',
  imports: [
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent {
  private activityService = inject(ActivityService);
  private formBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ActivityComponent>);

  isLoading = signal<boolean>(false);
  error = signal<ApiError | null>(null);

  constructor(@Inject(LOCALE_ID) public locale: string) {}

  activityForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  onSubmit() {
    if (this.activityForm.valid) {
      this.isLoading.set(true);
      var activityData: CreateActivityRequest = this.activityForm.value;
      activityData.startDate = formatDate(activityData.startDate, 'yyyy-MM-dd', this.locale);
      activityData.endDate = formatDate(activityData.endDate, 'yyyy-MM-dd', this.locale);

      this.activityService.create(activityData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.error.set(null);
          this.dialogRef.close();
          this.activityForm.reset();
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
