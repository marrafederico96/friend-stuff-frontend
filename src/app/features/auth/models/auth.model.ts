export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface TokenResponse {
  jwt: string;
}
