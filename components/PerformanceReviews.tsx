import React, { useState } from 'react';
import { User, PerformanceReview, ReviewStatus } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import ProgressBar from './ui/ProgressBar';
import { PerformanceReviewIcon, CheckCircleIcon } from './ui/icons/Icon';
import { MOCK_PERFORMANCE_REVIEWS } from '../constants';

interface PerformanceReviewsProps {
  user: User;
}

const PerformanceReviews: React.FC<PerformanceReviewsProps> = ({ user }) => {
  const { config } = useIndustry();
  const [reviews] = useState<PerformanceReview[]>(MOCK_PERFORMANCE_REVIEWS);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'scheduled': return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
    }
  };

  const getOverallRating = (review: PerformanceReview) => {
    if (!review.selfAssessment) return null;
    const ratings = [
      review.selfAssessment.performanceRating,
      review.selfAssessment.goalsAchievement,
      review.selfAssessment.skillsGrowth,
      review.selfAssessment.teamwork,
      review.selfAssessment.initiative
    ];
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const pendingReviews = reviews.filter(r => r.status === 'pending' || r.status === 'in_progress');
  const completedReviews = reviews.filter(r => r.status === 'completed');
  const scheduledReviews = reviews.filter(r => r.status === 'scheduled');

  const openReview = (review: PerformanceReview) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white">
              <PerformanceReviewIcon className="w-6 h-6" />
            </div>
            Performance Reviews
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Track your growth and feedback throughout the year
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass" padding="md">
          <p className="text-sm text-gray-500 dark:text-slate-400">Pending Reviews</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{pendingReviews.length}</p>
        </Card>
        <Card variant="glass" padding="md">
          <p className="text-sm text-gray-500 dark:text-slate-400">Completed This Year</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{completedReviews.length}</p>
        </Card>
        <Card variant="glass" padding="md">
          <p className="text-sm text-gray-500 dark:text-slate-400">Upcoming</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{scheduledReviews.length}</p>
        </Card>
        <Card variant="glass" padding="md">
          <p className="text-sm text-gray-500 dark:text-slate-400">Average Rating</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {completedReviews.length > 0 ? '4.2' : '-'}/5
          </p>
        </Card>
      </div>

      {/* Action Required */}
      {pendingReviews.length > 0 && (
        <Card variant="elevated" className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Action Required
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                You have {pendingReviews.length} review(s) that need your attention
              </p>
            </div>
            <Button onClick={() => pendingReviews[0] && openReview(pendingReviews[0])}>
              Start Review
            </Button>
          </div>
        </Card>
      )}

      {/* Current/Upcoming Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending & In Progress */}
        <Card variant="bordered">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Reviews
          </h3>
          <div className="space-y-4">
            {[...pendingReviews, ...scheduledReviews].map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => openReview(review)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{review.period} Review</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Due: {new Date(review.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(review.status)}`}>
                    {review.status.replace('_', ' ')}
                  </span>
                </div>
                {review.status === 'in_progress' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>60%</span>
                    </div>
                    <ProgressBar value={60} variant="gradient" size="sm" />
                  </div>
                )}
              </div>
            ))}
            {pendingReviews.length === 0 && scheduledReviews.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                No current reviews
              </p>
            )}
          </div>
        </Card>

        {/* Review History */}
        <Card variant="bordered">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Review History
          </h3>
          <div className="space-y-4">
            {completedReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => openReview(review)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {review.period} Review
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Completed: {review.completedDate ? new Date(review.completedDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {getOverallRating(review) || '-'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Overall</p>
                  </div>
                </div>
              </div>
            ))}
            {completedReviews.length === 0 && (
              <p className="text-center text-gray-500 dark:text-slate-400 py-8">
                No completed reviews yet
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Review Tips */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tips for a Great Self-Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-gray-900 dark:text-white">Use Data</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Back up your achievements with specific metrics and examples
            </p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-medium text-gray-900 dark:text-white">Align with Goals</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Reference your quarterly goals and how you've progressed
            </p>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-medium text-gray-900 dark:text-white">Be Honest</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Acknowledge challenges and areas where you want to grow
            </p>
          </div>
        </div>
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`${selectedReview?.period || ''} Performance Review`}
        size="xl"
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* Review Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Review Period</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedReview.period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Due Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedReview.dueDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedReview.status)}`}>
                {selectedReview.status.replace('_', ' ')}
              </span>
            </div>

            {/* Self Assessment Form */}
            {(selectedReview.status === 'pending' || selectedReview.status === 'in_progress') && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Self Assessment</h4>
                
                {/* Rating Sections */}
                {['Performance', 'Goals Achievement', 'Skills Growth', 'Teamwork', 'Initiative'].map((category, i) => (
                  <div key={category} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-medium text-gray-900 dark:text-white">{category}</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            className="w-8 h-8 rounded-lg text-sm font-medium bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder={`Describe your ${category.toLowerCase()} this period...`}
                      className="w-full p-3 bg-white dark:bg-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={2}
                    />
                  </div>
                ))}

                {/* Key Achievements */}
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <label className="font-medium text-gray-900 dark:text-white mb-3 block">
                    Key Achievements
                  </label>
                  <textarea
                    placeholder="List your main accomplishments this period..."
                    className="w-full p-3 bg-white dark:bg-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={4}
                  />
                </div>

                {/* Growth Areas */}
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <label className="font-medium text-gray-900 dark:text-white mb-3 block">
                    Areas for Growth
                  </label>
                  <textarea
                    placeholder="What areas would you like to develop?"
                    className="w-full p-3 bg-white dark:bg-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Completed Review Display */}
            {selectedReview.status === 'completed' && selectedReview.selfAssessment && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Your Assessment</h4>
                
                {/* Ratings Display */}
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Performance', value: selectedReview.selfAssessment.performanceRating },
                    { label: 'Goals', value: selectedReview.selfAssessment.goalsAchievement },
                    { label: 'Skills', value: selectedReview.selfAssessment.skillsGrowth },
                    { label: 'Teamwork', value: selectedReview.selfAssessment.teamwork },
                    { label: 'Initiative', value: selectedReview.selfAssessment.initiative },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{item.value}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Written Feedback */}
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Key Achievements</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-slate-300">
                    {selectedReview.selfAssessment.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                {selectedReview.managerAssessment && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <h5 className="font-medium text-indigo-900 dark:text-indigo-200 mb-2">Manager Feedback</h5>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      {selectedReview.managerAssessment.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
              {(selectedReview.status === 'pending' || selectedReview.status === 'in_progress') ? (
                <>
                  <Button variant="secondary" className="flex-1" onClick={() => setShowReviewModal(false)}>
                    Save Draft
                  </Button>
                  <Button className="flex-1">
                    Submit Review
                  </Button>
                </>
              ) : (
                <Button variant="secondary" className="flex-1" onClick={() => setShowReviewModal(false)}>
                  Close
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PerformanceReviews;
