import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CreateActivityRequest } from '../models/activity.service';
import { Observable } from 'rxjs';
import { Result } from '../../../core/models/result.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  create(data: CreateActivityRequest): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/Activity/Create`, data);
  }
}
