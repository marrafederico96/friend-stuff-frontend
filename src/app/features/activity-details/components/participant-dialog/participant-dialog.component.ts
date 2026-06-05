import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiError } from '../../../../core/models/result.model';

@Component({
  selector: 'app-participant-dialog',
  imports: [
    MatButtonModule,
    MatDialogContent,
    MatInputModule,
    MatDialogTitle,
    MatFormFieldModule,
    MatLabel,
    MatError,
    MatDialogActions,
    MatProgressSpinnerModule,
  ],
  templateUrl: './participant-dialog.component.html',
  styleUrl: './participant-dialog.component.scss',
})
export class ParticipantDialogComponent {
  isLoading = signal<boolean>(false);
  error = signal<ApiError | undefined>(undefined);

  readonly dialogRef = inject(MatDialogRef<ParticipantDialogComponent>);

  close() {
    this.dialogRef.close();
  }
}
