import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
// Material component
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-auth',
  imports: [
    MatInputModule,
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

  isLoginPage = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.url.subscribe({
      next: (data) => {
        this.isLoginPage.set(data[data.length - 1].path === 'login');
      },
    });
  }
}
