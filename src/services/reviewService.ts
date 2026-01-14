/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PerformanceReview, ReviewStatus } from '../types';
import { MOCK_REVIEWS } from '../constants';
import type { Database } from '../types/database';

type DbReviewStatus = Database['public']['Tables']['performance_reviews']['Row']['status'];

type ReviewRow = Database['public']['Tables']['performance_reviews']['Row'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mapDbStatusToApp = (status: string): ReviewStatus => {
  switch (status) {
    case 'draft':
      return 'pending';
    case 'submitted':
      return 'in_progress';
    case 'completed':
      return 'completed';
    default:
      return 'pending';
  }
};

const mapAppStatusToDb = (status: ReviewStatus): DbReviewStatus => {
  switch (status) {
    case 'pending':
    case 'scheduled':
      return 'draft';
    case 'in_progress':
      return 'submitted';
    case 'completed':
      return 'completed';
    default:
      return 'draft';
  }
};

export const ReviewService = {
  /**
   * Fetch all reviews for a specific employee
   */
  getReviewsByEmployeeId: async (employeeId: string): Promise<PerformanceReview[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase as any)
        .from('performance_reviews')
        .select('*')
        .eq('employee_id', employeeId);

      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }

      const rows = (data || []) as unknown as ReviewRow[];

      return rows.map(r => ({
        id: r.id,
        employeeId: r.employee_id,
        managerId: r.reviewer_id,
        period: r.period,
        status: mapDbStatusToApp(r.status),
        dueDate: r.created_at, // Placeholder
        overallRating: r.overall_rating || undefined,
      }));
    }

    await delay(400);
    const stored = localStorage.getItem('zirtually_reviews');
    const allReviews: PerformanceReview[] = stored ? JSON.parse(stored) : MOCK_REVIEWS;
    return allReviews.filter(review => review.employeeId === employeeId);
  },

  /**
   * Fetch reviews managed by a specific manager
   */
  getManagedReviews: async (managerId: string): Promise<PerformanceReview[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase as any)
        .from('performance_reviews')
        .select('*')
        .eq('reviewer_id', managerId);

      if (error) {
        console.error('Error fetching managed reviews:', error);
        return [];
      }

      const rows = (data || []) as unknown as ReviewRow[];

      return rows.map(r => ({
        id: r.id,
        employeeId: r.employee_id,
        managerId: r.reviewer_id,
        period: r.period,
        status: mapDbStatusToApp(r.status),
        dueDate: r.created_at,
        overallRating: r.overall_rating || undefined,
      }));
    }

    await delay(400);
    const stored = localStorage.getItem('zirtually_reviews');
    const allReviews: PerformanceReview[] = stored ? JSON.parse(stored) : MOCK_REVIEWS;
    return allReviews.filter(review => review.managerId === managerId);
  },

  /**
   * Update a review (e.g., submitting self-assessment)
   */
  updateReview: async (updatedReview: PerformanceReview): Promise<PerformanceReview | null> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await (supabase as any)
        .from('performance_reviews')
        .update({
          status: mapAppStatusToDb(updatedReview.status),
          overall_rating: updatedReview.overallRating,
          strengths: updatedReview.strengths,
          areas_for_improvement: updatedReview.areasForImprovement,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', updatedReview.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from update');
      }

      const r = data as unknown as ReviewRow;

      return {
        id: r.id,
        employeeId: r.employee_id,
        managerId: r.reviewer_id,
        period: r.period,
        status: mapDbStatusToApp(r.status),
        dueDate: r.created_at,
        overallRating: r.overall_rating || undefined,
      };
    }

    await delay(300);
    const stored = localStorage.getItem('zirtually_reviews');
    const allReviews: PerformanceReview[] = stored ? JSON.parse(stored) : [...MOCK_REVIEWS];

    const index = allReviews.findIndex(r => r.id === updatedReview.id);
    if (index !== -1) {
      allReviews[index] = updatedReview;
    }

    localStorage.setItem('zirtually_reviews', JSON.stringify(allReviews));
    return updatedReview;
  },
};
