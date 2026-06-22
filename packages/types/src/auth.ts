export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: import("./user").User;
  accessToken: string;
}
