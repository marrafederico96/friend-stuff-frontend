import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, debounceTime, filter, of, switchMap } from 'rxjs';
import { ApiError } from '../../../core/models/result.model';
import { AddActivityParticipantRequest } from '../models/activity-details.model';
import { ActivityDetailsService } from '../services/activity-details.service';

@Component({
  selector: 'app-participant-dialog',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogActions,
    MatDialogContent,
  ],
  templateUrl: './participant-dialog.component.html',
  styleUrl: './participant-dialog.component.scss',
})
export class ParticipantDialogComponent implements OnInit {
  private activityDetailsService = inject(ActivityDetailsService);
  private destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(false);
  error = signal<ApiError | undefined>(undefined);
  readonly dialogRef = inject(MatDialogRef<ParticipantDialogComponent>);
  selectedUsernames = signal<string[]>([]);
  responseUsername = signal<string>('');
  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        filter((value): value is string => !!value && value.length >= 2),
        switchMap((value) => {
          this.isLoading.set(true);
          this.error.set(undefined);
          this.responseUsername.set('');
          return this.activityDetailsService.searchUser(value).pipe(
            catchError((response: HttpErrorResponse) => {
              this.error.set(response.error);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response?.value) this.responseUsername.set(response.value);
        },
      });
  }

  addUser() {
    const username = this.responseUsername();
    if (!username || this.selectedUsernames().includes(username)) return;
    this.selectedUsernames.update((list) => [...list, username]);
    this.searchControl.reset('');
    this.responseUsername.set('');
    this.error.set(undefined);
  }

  removeUser(username: string) {
    this.selectedUsernames.update((list) => list.filter((u) => u !== username));
  }

  confirm() {
    this.dialogRef.close(this.selectedUsernames());
    var publicId = this.activityDetailsService.activityDetails()?.activity.publicId;
    if (publicId) {
      const data: AddActivityParticipantRequest = {
        usernames: this.selectedUsernames(),
        publicActivityId: publicId,
      };
      this.activityDetailsService.addActivityParticipant(data).subscribe();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
