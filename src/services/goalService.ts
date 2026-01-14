/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../types/database';
import { Goal as AppGoal, GoalStatus } from '../types';
import { MOCK_GOALS } from '../constants';

type GoalRow = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type DbGoalStatus = GoalRow['status'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mapStatus = (status: string): GoalStatus => {
  switch (status) {
    case 'not-started':
    case 'in-progress':
    case 'completed':
    case 'blocked':
      return status;
    default:
      return 'not-started';
  }
};

export const GoalService = {
  /**
   * Fetch all goals for a user
   */
  getGoalsByUserId: async (userId: string): Promise<AppGoal[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase as any)
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }

      const rows = (data || []) as unknown as GoalRow[];

      // Map DB response to AppGoal
      return rows.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description || '',
        owner: g.user_id,
        progress: g.progress,
        dueDate: g.due_date || '',
        category: 'Professional', // Default as it's not in DB yet
        status: mapStatus(g.status),
        milestones: [],
        comments: [],
        isTeamGoal: false, // Default
        priority: 'Medium', // Default
        estimatedTime: 0, // Default
      }));
    }

    // Mock mode (localStorage)
    await delay(300);
    const stored = localStorage.getItem('zirtually_goals');
    const all: AppGoal[] = stored ? JSON.parse(stored) : MOCK_GOALS;
    return all.filter(g => g.owner === userId);
  },

  /**
   * Create a new goal
   */
  createGoal: async (goal: AppGoal | GoalInsert): Promise<AppGoal | null> => {
    if (isSupabaseConfigured()) {
      const dbGoal: GoalInsert = {
        title: 'title' in goal ? goal.title : '',
        user_id: 'owner' in goal ? (goal.owner as string) : (goal as GoalInsert).user_id,
        description: 'description' in goal ? goal.description : '',
        progress: 'progress' in goal ? goal.progress : 0,
        status: 'status' in goal ? (goal.status as DbGoalStatus) : 'not-started',
        due_date: 'dueDate' in goal ? (goal.dueDate as string) : null,
      };

      const { data, error } = await (supabase as any)
        .from('goals')
        .insert(dbGoal as any)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from create');
      }

      const row = data as unknown as GoalRow;

      return {
        id: row.id,
        title: row.title,
        description: row.description || '',
        owner: row.user_id,
        progress: row.progress,
        dueDate: row.due_date || '',
        category: 'Professional',
        status: mapStatus(row.status),
        milestones: [],
        comments: [],
        isTeamGoal: false, // Default
        priority: 'Medium', // Default
        estimatedTime: 0, // Default
      };
    }

    // Mock mode
    await delay(300);
    const stored = localStorage.getItem('zirtually_goals');
    const all: AppGoal[] = stored ? JSON.parse(stored) : [...MOCK_GOALS];
    const newGoal = { ...goal } as AppGoal;
    all.push(newGoal);
    localStorage.setItem('zirtually_goals', JSON.stringify(all));
    return newGoal;
  },

  /**
   * Update a goal
   */
  updateGoal: async (updatedGoal: AppGoal): Promise<AppGoal | null> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase as any)
        .from('goals')
        .update({
          title: updatedGoal.title,
          description: updatedGoal.description,
          progress: updatedGoal.progress,
          status: updatedGoal.status as DbGoalStatus,
          due_date: updatedGoal.dueDate,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', updatedGoal.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      const row = data as unknown as GoalRow;

      return {
        id: row.id,
        title: row.title,
        description: row.description || '',
        owner: row.user_id,
        progress: row.progress,
        dueDate: row.due_date || '',
        category: updatedGoal.category,
        status: mapStatus(row.status),
        milestones: updatedGoal.milestones,
        comments: updatedGoal.comments,
        isTeamGoal: updatedGoal.isTeamGoal,
        priority: updatedGoal.priority,
        estimatedTime: updatedGoal.estimatedTime,
      };
    }

    // Mock mode
    await delay(300);
    const stored = localStorage.getItem('zirtually_goals');
    const all: AppGoal[] = stored ? JSON.parse(stored) : [...MOCK_GOALS];
    const index = all.findIndex(g => g.id === updatedGoal.id);
    if (index !== -1) {
      all[index] = updatedGoal;
    }
    localStorage.setItem('zirtually_goals', JSON.stringify(all));
    return updatedGoal;
  },

  /**
   * Delete a goal
   */
  deleteGoal: async (goalId: string): Promise<void> => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('goals').delete().eq('id', goalId);

      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    // Mock mode
    await delay(300);
    const stored = localStorage.getItem('zirtually_goals');
    let all: AppGoal[] = stored ? JSON.parse(stored) : [...MOCK_GOALS];
    all = all.filter(g => g.id !== goalId);
    localStorage.setItem('zirtually_goals', JSON.stringify(all));
  },
};
