import { UserActivityResponse } from '../../activity/models/activity.model';

export interface UserActivityDetailsResponse {
  activity: UserActivityResponse;
  expenses: ExpenseInfoResponse[];
}

export interface ExpenseInfoResponse {
  expensePublicId: string;
  expenseDescription?: string;
  amount: number;
  expenseName: string;
  participants: string[];
}

export interface CreateExpenseRequest {
  name: string;
  description?: string;
  amount: number;
  activityPublicId: string;
}

export interface RemoveParicipantRequest {
  username: string;
  publicActivityId: string;
}
