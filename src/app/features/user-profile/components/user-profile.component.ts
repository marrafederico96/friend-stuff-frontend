import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserProfileService } from '../services/user-profile.service';

// Material component
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-user-profile',
  imports: [MatCardModule, CommonModule, MatChipsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  private userProfileService = inject(UserProfileService);

  balanceInfo = computed(() => this.userProfileService.balanceInfo());

  totalBalance = computed(() => {
    var totalAmount = 0;
    this.userProfileService.balanceInfo().forEach((e) => {
      totalAmount += e.amount;
    });
    return parseFloat(totalAmount.toPrecision(4));
  });

  balanceIsLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.balanceIsLoading.set(true);
    this.userProfileService.getBalance().subscribe({
      next: () => {
        this.balanceIsLoading.set(false);
      },
      error: () => {
        this.balanceIsLoading.set(false);
      },
    });
  }
}
