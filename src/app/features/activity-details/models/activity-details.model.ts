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
}

export interface CreateExpenseRequest {
  name: string;
  description?: string;
  amount: number;
  activityPublicId: string;
}
