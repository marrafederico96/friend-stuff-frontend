export interface Result<T = void> {
  isSuccess: boolean;
  successMessage?: string;
  error?: ApiError;
  value?: T;
}

export interface ApiError {
  title: string;
  message: string;
  type: ErrorType;
}

enum ErrorType {
  NotFound,
  Forbidden,
  Conflict,
  Validation,
  Unauthorized,
  InternalError,
}
