import { UserActivityResponse } from '../../activity/models/activity.model';

export interface UserActivityDetailsResponse {
  activity: UserActivityResponse;
  expenses: ExpenseInfoResponse[];
}

export interface ExpenseInfoResponse {
  expensePublicId: string;
  expenseDescription?: string;
  amount: number;
  payerUsername: string;
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

export interface AddExpenseParticipantRequest {
  usernames: string[];
  publicActivityId: string;
  publicExpenseId: string;
}

export interface RemoveExpenseParicipantRequest {
  username: string;
  expensePublicId: string;
}
