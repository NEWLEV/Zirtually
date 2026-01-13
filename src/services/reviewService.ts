import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PerformanceReview } from '../types';
import { MOCK_REVIEWS } from '../constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ReviewService = {
  /**
   * Fetch all reviews for a specific employee
   */
  getReviewsByEmployeeId: async (employeeId: string): Promise<PerformanceReview[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select('*')
        .eq('employee_id', employeeId);

      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }

      return (data || []).map(r => ({
        id: r.id,
        employeeId: r.employee_id,
        managerId: r.reviewer_id,
        period: r.period,
        status: r.status as any,
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
      const { data, error } = await supabase
        .from('performance_reviews')
        .select('*')
        .eq('reviewer_id', managerId);

      if (error) {
        console.error('Error fetching managed reviews:', error);
        return [];
      }

      return (data || []).map(r => ({
        id: r.id,
        employeeId: r.employee_id,
        managerId: r.reviewer_id,
        period: r.period,
        status: r.status as any,
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
      const { data, error } = await supabase
        .from('performance_reviews')
        .update({
          status: updatedReview.status as any,
          overall_rating: updatedReview.overallRating,
          strengths: updatedReview.strengths,
          areas_for_improvement: updatedReview.areasForImprovement,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedReview.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        id: data.id,
        employeeId: data.employee_id,
        managerId: data.reviewer_id,
        period: data.period,
        status: data.status as any,
        dueDate: data.created_at,
        overallRating: data.overall_rating || undefined,
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
