import { User } from '../../types';

export interface LoginCredentials {
  email: string;
  password?: string; // Optional for mock, required for real auth
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  getUsers(): Promise<User[]>; // For the mock user picker
  signUp?(
    credentials: LoginCredentials & { fullName: string; department: string }
  ): Promise<AuthResponse>;
}
