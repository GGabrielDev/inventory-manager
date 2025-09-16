import type { User } from './user';

export interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
