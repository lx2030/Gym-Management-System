export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}