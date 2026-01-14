import { IAuthService, LoginCredentials, AuthResponse } from './types';
import { User } from '../../types';
import { MOCK_USERS } from '../../constants';
import { AuditLogService } from '../auditLogService';

export class MockAuthService implements IAuthService {
  private users: User[];
  private currentUser: User | null = null;
  private readonly STORAGE_KEY_USERS = 'zirtually_users';
  private readonly STORAGE_KEY_CURRENT_USER = 'zirtually_current_user';

  constructor() {
    // Initialize users from localStorage or fall back to constants
    const storedUsers = localStorage.getItem(this.STORAGE_KEY_USERS);
    this.users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;

    // Initialize current user
    const storedCurrent = localStorage.getItem(this.STORAGE_KEY_CURRENT_USER);
    if (storedCurrent) {
      this.currentUser = JSON.parse(storedCurrent);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // In mock mode, we just find the user by email or simple selection
    const user = this.users.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('User not found');
    }

    this.currentUser = user;
    this.persistCurrentUser();
    AuditLogService.createLog(user, 'USER_LOGIN', 'security', 'User logged into Zirtually.');

    return { user };
  }

  async logout(): Promise<void> {
    if (this.currentUser) {
      AuditLogService.createLog(this.currentUser, 'USER_LOGOUT', 'security', 'User logged out of Zirtually.');
    }
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY_CURRENT_USER);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async updateUser(updatedUser: User): Promise<User> {
    this.users = this.users.map(u => (u.id === updatedUser.id ? updatedUser : u));
    this.currentUser = updatedUser;

    this.persistUsers();
    this.persistCurrentUser();
    AuditLogService.createLog(updatedUser, 'UPDATE_PROFILE', 'user', 'User updated their profile.');

    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  private persistUsers(): void {
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(this.users));
  }

  private persistCurrentUser(): void {
    if (this.currentUser) {
      localStorage.setItem(this.STORAGE_KEY_CURRENT_USER, JSON.stringify(this.currentUser));
    }
  }
}
