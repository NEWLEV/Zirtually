import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../types/database';
import { Goal as AppGoal, GoalStatus, Priority } from '../types';
import { MOCK_GOALS } from '../constants';
import { eventBus } from './eventBus';

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
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .or(`user_id.eq.${userId},is_team_goal.eq.true`) // Fetch own goals + team goals
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }

      const rows = (data || []) as unknown as GoalRow[];

      return rows.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description || '',
        owner: g.user_id,
        progress: g.progress,
        dueDate: g.due_date || '',
        status: mapStatus(g.status),
        category: g.category || 'Professional',
        priority: (g.priority as Priority) || 'Medium',
        estimatedTime: g.estimated_time || 0,
        isTeamGoal: g.is_team_goal || false,
        milestones: [],
        comments: [],
      }));
    }

    // Mock Fallback
    await delay(300);
    const stored = localStorage.getItem('zirtually_goals');
    const all: AppGoal[] = stored ? JSON.parse(stored) : MOCK_GOALS;
    return all.filter(g => g.owner === userId || g.isTeamGoal);
  },

  /**
   * Create a new goal
   */
  createGoal: async (goal: AppGoal): Promise<AppGoal | null> => {
    let createdGoal: AppGoal | null = null;

    if (isSupabaseConfigured()) {
      const dbGoal: GoalInsert = {
        title: goal.title,
        user_id: goal.owner,
        description: goal.description,
        progress: goal.progress,
        status: goal.status as DbGoalStatus,
        due_date: goal.dueDate || null,
        priority: goal.priority as GoalRow['priority'],
        category: goal.category,
        estimated_time: goal.estimatedTime,
        is_team_goal: goal.isTeamGoal,
      };

      const { data, error } = await supabase.from('goals').insert(dbGoal).select().single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No data returned from create');

      createdGoal = { ...goal, id: data.id };
    } else {
      // Mock Create Logic
      await delay(300);
      const stored = localStorage.getItem('zirtually_goals');
      const all: AppGoal[] = stored ? JSON.parse(stored) : [...MOCK_GOALS];
      const newGoal = { ...goal, id: `goal-${Date.now()}` };
      all.push(newGoal);
      localStorage.setItem('zirtually_goals', JSON.stringify(all));
      createdGoal = newGoal;
    }

    if (createdGoal) {
      eventBus.publish('goal.created', createdGoal);
    }
    return createdGoal;
  },

  /**
   * Update a goal
   */
  updateGoal: async (updatedGoal: AppGoal): Promise<AppGoal | null> => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('goals')
        .update({
          title: updatedGoal.title,
          description: updatedGoal.description,
          progress: updatedGoal.progress,
          status: updatedGoal.status as DbGoalStatus,
          due_date: updatedGoal.dueDate || null,
          priority: updatedGoal.priority as GoalRow['priority'],
          category: updatedGoal.category,
          estimated_time: updatedGoal.estimatedTime,
          is_team_goal: updatedGoal.isTeamGoal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedGoal.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
    } else {
      // Mock Update Logic
      await delay(300);
      const stored = localStorage.getItem('zirtually_goals');
      const all: AppGoal[] = stored ? JSON.parse(stored) : [...MOCK_GOALS];
      const index = all.findIndex(g => g.id === updatedGoal.id);
      if (index !== -1) {
        all[index] = updatedGoal;
      }
      localStorage.setItem('zirtually_goals', JSON.stringify(all));
    }

    eventBus.publish('goal.updated', updatedGoal);
    if (updatedGoal.progress === 100 || updatedGoal.status === 'completed') {
      eventBus.publish('goal.completed', updatedGoal);
    }

    return updatedGoal;
  },

  /**
   * Delete a goal
   */
  deleteGoal: async (goalId: string): Promise<void> => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('goals').delete().eq('id', goalId);
      if (error) throw new Error(error.message);
    } else {
      // Mock mode
      await delay(300);
      const stored = localStorage.getItem('zirtually_goals');
      let all: AppGoal[] = stored ? JSON.parse(stored) : [...MOCK_GOALS];
      all = all.filter(g => g.id !== goalId);
      localStorage.setItem('zirtually_goals', JSON.stringify(all));
    }
  },
};

