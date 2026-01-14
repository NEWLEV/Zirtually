/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAuthService, LoginCredentials, AuthResponse } from './types';
import { User } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { mapProfileToUser } from './mapper';
import { Database } from '../../types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

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

    const { data: profileData, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileData) {
      throw new Error('User profile not found');
    }

    const profile = profileData as unknown as ProfileRow;

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

    const { data: profileData } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profileData) return null;

    const profile = profileData as unknown as ProfileRow;
    return mapProfileToUser(profile);
  }

  async updateUser(updatedUser: User): Promise<User> {
    if (!isSupabaseConfigured()) return updatedUser;

    const { data, error } = await (supabase as any)
      .from('profiles')
      .update({
        full_name: updatedUser.name,
        avatar_url: updatedUser.avatarUrl,
        department: updatedUser.department,
        // Add other mapped fields here
      } as any)
      .eq('id', updatedUser.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Failed to update profile');
    }

    const profile = data as unknown as ProfileRow;
    return mapProfileToUser(profile);
  }

  async getUsers(): Promise<User[]> {
    // In a real app, this might be restricted or paginated
    // For compatibility with the mock UI during transition:
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase.from('profiles').select('*').limit(100);

    if (error || !data) return [];

    const profiles = data as unknown as ProfileRow[];
    return profiles.map(mapProfileToUser);
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

    const { data: profileData, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profileData) {
      // If the trigger hasn't finished yet, we might need to retry or create it manually here
      // For now, assume trigger works or create manually

      const { data: manualProfileData, error: manualError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: data.user.id,
          email: credentials.email,
          full_name: credentials.fullName,
          department: credentials.department,
          role: 'employee',
        } as any)
        .select()
        .single();

      if (manualError || !manualProfileData) {
        throw new Error('Failed to create user profile');
      }

      const manualProfile = manualProfileData as unknown as ProfileRow;
      return { user: mapProfileToUser(manualProfile) };
    }

    const profile = profileData as unknown as ProfileRow;
    return {
      user: mapProfileToUser(profile),
    };
  }
}
