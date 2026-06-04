import { Component, inject, OnInit } from '@angular/core';

// Material component+
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from '../../features/activity/services/activity.service';

@Component({
  selector: 'app-activity',
  imports: [MatCardModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss',
})
export class ActivityComponent implements OnInit {
  private activityServiece = inject(ActivityService);
  private activatedRoute = inject(ActivatedRoute);

  private publicActivityId: string = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (data) => {
        this.publicActivityId = data['publicActivityId'];
      },
    });
  }
}
