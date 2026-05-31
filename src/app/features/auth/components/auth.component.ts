import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { ApiError } from '../../../core/models/result.model';
import { HttpErrorResponse } from '@angular/common/http';

// Material component
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-auth',
  imports: [
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  isLoginPage = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  error = signal<ApiError | null>(null);
  authForm!: FormGroup;

  ngOnInit(): void {
    this.activatedRoute.url.subscribe({
      next: (data) => {
        this.isLoginPage.set(data[data.length - 1].path === 'login');
        this.generateForm();
      },
    });
  }

  private generateForm() {
    if (!this.isLoginPage()) {
      this.authForm = this.formBuilder.group({
        username: ['', Validators.required],
        emailAddress: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      });
    } else {
      this.authForm = this.formBuilder.group({
        emailAddress: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
    }
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.isLoading.set(true);
      if (this.isLoginPage()) {
        var loginData: LoginRequest = this.authForm.value;
        this.authService.login(loginData).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.error.set(null);
            this.authForm.reset();
            this.router.navigate(['']);
          },
          error: (response: HttpErrorResponse) => {
            var apiError = response.error;
            this.error.set(apiError);
            this.isLoading.set(false);
          },
        });
      } else {
        var registerData: RegisterRequest = this.authForm.value;
        this.authService.register(registerData).subscribe({
          next: () => {
            this.error.set(null);
            this.isLoading.set(false);
            this.authForm.reset();
            this.router.navigate(['/auth/login']);
          },
          error: (response: HttpErrorResponse) => {
            var apiError = response.error;
            this.error.set(apiError);
            this.isLoading.set(false);
          },
        });
      }
    }
  }
}
