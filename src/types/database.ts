// Database type definitions for Supabase
// This file will be auto-generated once you run: npx supabase gen types typescript --project-id your-project-id
// For now, we define the core schema manually

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'manager' | 'employee';
          department: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'manager' | 'employee';
          department: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'manager' | 'employee';
          department?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
          progress: number;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: 'not-started' | 'in-progress' | 'completed' | 'blocked';
          progress?: number;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: 'not-started' | 'in-progress' | 'completed' | 'blocked';
          progress?: number;
          due_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      performance_reviews: {
        Row: {
          id: string;
          employee_id: string;
          reviewer_id: string;
          period: string;
          status: 'draft' | 'submitted' | 'completed';
          overall_rating: number | null;
          strengths: string | null;
          areas_for_improvement: string | null;
          goals_next_period: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          reviewer_id: string;
          period: string;
          status?: 'draft' | 'submitted' | 'completed';
          overall_rating?: number | null;
          strengths?: string | null;
          areas_for_improvement?: string | null;
          goals_next_period?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          reviewer_id?: string;
          period?: string;
          status?: 'draft' | 'submitted' | 'completed';
          overall_rating?: number | null;
          strengths?: string | null;
          areas_for_improvement?: string | null;
          goals_next_period?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    Relationships: [];
  };
}
