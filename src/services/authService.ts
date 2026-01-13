import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Sign-in skipped.');
    return null;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    return null;
  }

  // Fetch the user's profile
  const profile = await getProfile(data.user.id);

  return {
    id: data.user.id,
    email: data.user.email!,
    profile,
  };
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  department: string
): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Sign-up skipped.');
    return null;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    return null;
  }

  // Create the user's profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    email,
    full_name: fullName,
    department,
    role: 'employee', // Default role
  } as unknown as never);

  if (profileError) {
    throw new Error(profileError.message);
  }

  const profile = await getProfile(data.user.id);

  return {
    id: data.user.id,
    email: data.user.email!,
    profile,
  };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Get a user's profile by ID
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update a user's profile
 */
export async function updateProfile(
  userId: string,
  updates: Database['public']['Tables']['profiles']['Update']
): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() } as unknown as never)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return data.subscription.unsubscribe;
}
