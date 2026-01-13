import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../types/database';
import { Goal as AppGoal } from '../types';
import { MOCK_GOALS } from '../constants';

type GoalInsert = Database['public']['Tables']['goals']['Insert'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const GoalService = {
  /**
   * Fetch all goals for a user
   */
  getGoalsByUserId: async (userId: string): Promise<AppGoal[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }

      // Map DB response to AppGoal
      return (data || []).map(g => ({
        id: g.id,
        title: g.title,
        description: g.description || '',
        owner: g.user_id,
        progress: g.progress,
        dueDate: g.due_date || '',
        category: 'Professional', // Default as it's not in DB yet
        status: g.status,
        milestones: [],
        comments: [],
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
        status: 'status' in goal ? (goal.status as any) : 'not-started',
        due_date: 'dueDate' in goal ? (goal.dueDate as string) : null,
      };

      const { data, error } = await supabase.from('goals').insert(dbGoal).select().single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        owner: data.user_id,
        progress: data.progress,
        dueDate: data.due_date || '',
        category: 'Professional',
        status: data.status,
        milestones: [],
        comments: [],
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
      const { data, error } = await supabase
        .from('goals')
        .update({
          title: updatedGoal.title,
          description: updatedGoal.description,
          progress: updatedGoal.progress,
          status: updatedGoal.status as any,
          due_date: updatedGoal.dueDate,
          updated_at: new Date().toISOString(),
        } as Database['public']['Tables']['goals']['Update'])
        .eq('id', updatedGoal.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        owner: data.user_id,
        progress: data.progress,
        dueDate: data.due_date || '',
        category: updatedGoal.category,
        status: data.status,
        milestones: updatedGoal.milestones,
        comments: updatedGoal.comments,
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
