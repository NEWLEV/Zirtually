/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';
import type { Database } from '../types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Simulator delay to mimic API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mapRole = (role: string): UserRole => {
  switch (role) {
    case 'admin':
      return UserRole.ADMIN;
    case 'manager':
      return UserRole.MANAGER;
    case 'employee':
      return UserRole.STAFF;
    default:
      return UserRole.STAFF;
  }
};

export const UserService = {
  /**
   * Fetch all users
   */
  getAllUsers: async (): Promise<User[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('profiles').select('*').limit(100);

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      const profiles = data as unknown as ProfileRow[];

      return (profiles || []).map(u => ({
        id: u.id,
        name: u.full_name,
        email: u.email,
        role: mapRole(u.role),
        department: u.department,
        avatarUrl:
          u.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=random`,
        isNewHire: false,
      }));
    }

    await delay(200);
    const stored = localStorage.getItem('zirtually_users');
    if (stored) {
      return JSON.parse(stored);
    }
    return [...MOCK_USERS];
  },

  /**
   * Fetch a single user by ID
   */
  getUserById: async (id: string): Promise<User | undefined> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();

      if (error || !data) return undefined;

      const profile = data as unknown as ProfileRow;

      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: mapRole(profile.role),
        department: profile.department,
        avatarUrl:
          profile.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`,
        isNewHire: false,
      };
    }

    await delay(100);
    const users = await UserService.getAllUsers();
    return users.find(u => u.id === id);
  },

  /**
   * Update a user profile
   */
  updateUser: async (updatedUser: User): Promise<User> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: updatedUser.name,
          department: updatedUser.department,
          avatar_url: updatedUser.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedUser.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      const profile = data as unknown as ProfileRow;

      return {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        role: mapRole(profile.role),
        department: profile.department,
        avatarUrl:
          profile.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`,
        isNewHire: false,
      };
    }

    await delay(300);
    const users = await UserService.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);

    if (index === -1) {
      throw new Error('User not found');
    }

    const newUsers = [...users];
    newUsers[index] = updatedUser;

    localStorage.setItem('zirtually_users', JSON.stringify(newUsers));
    return updatedUser;
  },

  /**
   * Authenticate / Get Current User session
   */
  getCurrentUser: async (): Promise<User | null> => {
    if (isSupabaseConfigured()) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return null;
      return UserService.getUserById(session.user.id) as Promise<User | null>;
    }

    await delay(150);
    const stored = localStorage.getItem('zirtually_currentUser');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  },
};
