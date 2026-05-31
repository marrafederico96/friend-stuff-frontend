import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

// Material component
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  logout() {
    this.isLoading.set(true);
    this.authService.logout().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['auth/login']);
      },
    });
  }
}
