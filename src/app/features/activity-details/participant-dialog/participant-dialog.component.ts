import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiError } from '../../../core/models/result.model';

@Component({
  selector: 'app-participant-dialog',
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule, MatDialogActions, MatDialogContent],
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
