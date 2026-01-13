import { IAuthService, LoginCredentials, AuthResponse } from './types';
import { User } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { mapProfileToUser } from './mapper';

export class SupabaseAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please set environment variables.');
    }

    if (!credentials.password) {
      throw new Error('Password is required for production authentication.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Authentication failed');
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    return {
      user: mapProfileToUser(profile),
    };
  }

  async logout(): Promise<void> {
    if (!isSupabaseConfigured()) return;
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured()) return null;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return profile ? mapProfileToUser(profile) : null;
  }

  async updateUser(updatedUser: User): Promise<User> {
    if (!isSupabaseConfigured()) return updatedUser;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updatedUser.name,
        avatar_url: updatedUser.avatarUrl,
        department: updatedUser.department,
        // Add other mapped fields here
      })
      .eq('id', updatedUser.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update profile');
    }

    return mapProfileToUser(data);
  }

  async getUsers(): Promise<User[]> {
    // In a real app, this might be restricted or paginated
    // For compatibility with the mock UI during transition:
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase.from('profiles').select('*').limit(100);

    if (error || !data) return [];

    return data.map(mapProfileToUser);
  }

  async signUp(
    credentials: LoginCredentials & { fullName: string; department: string }
  ): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured.');
    }

    if (!credentials.password) {
      throw new Error('Password is required for registration.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
          department: credentials.department,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Registration failed');
    }

    // Profile is created by DB trigger in migration, but we fetch it to return mapped user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      // If the trigger hasn't finished yet, we might need to retry or create it manually here
      // For now, assume trigger works or create manually
      const { data: manualProfile, error: manualError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: credentials.email,
          full_name: credentials.fullName,
          department: credentials.department,
          role: 'employee',
        })
        .select()
        .single();

      if (manualError || !manualProfile) {
        throw new Error('Failed to create user profile');
      }

      return { user: mapProfileToUser(manualProfile) };
    }

    return {
      user: mapProfileToUser(profile),
    };
  }
}
