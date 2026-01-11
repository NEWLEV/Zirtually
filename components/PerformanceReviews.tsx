import React from 'react';
import { User, PerformanceReview, UserRole, ReviewStatus } from '../types';
import { MOCK_REVIEWS, MOCK_USERS } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';

interface PerformanceReviewsProps {
  user: User;
}

const StatusBadge: React.FC<{ status: ReviewStatus }> = ({ status }) => {
    const statusClasses = {
        'Pending Self-Assessment': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Pending Manager Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'Finalizing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};


const ReviewCard: React.FC<{ review: PerformanceReview, currentUser: User }> = ({ review, currentUser }) => {
    const employee = MOCK_USERS.find(u => u.id === review.employeeId);
    const manager = MOCK_USERS.find(u => u.id === review.managerId);

    if (!employee || !manager) return null;

    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-semibold text-brand-dark dark:text-dark-text">{review.reviewPeriod}</h4>
                    {currentUser.role === UserRole.MANAGER && (
                        <div className="flex items-center mt-1 space-x-2 text-sm text-gray-600 dark:text-dark-text-secondary">
                             <img src={employee.avatarUrl} alt={employee.name} className="w-6 h-6 rounded-full" />
                             <span>{employee.name}</span>
                        </div>
                    )}
                </div>
                <StatusBadge status={review.status} />
            </div>
            <div className="mt-4 border-t dark:border-dark-border pt-4">
                 <div className="flex justify-between items-center text-sm text-gray-500 dark:text-dark-text-secondary">
                    <span>Due Date: <span className="font-medium text-gray-700 dark:text-dark-text">{review.dueDate}</span></span>
                    {review.status === 'Completed' && review.completionDate && (
                       <span>Completed: <span className="font-medium text-gray-700 dark:text-dark-text">{review.completionDate}</span></span>
                    )}
                 </div>
                 <div className="mt-4 flex justify-end">
                    <Button variant="primary">
                        {review.status === 'Completed' ? 'View Details' : 'Continue Review'}
                    </Button>
                 </div>
            </div>
        </Card>
    )
}

const PerformanceReviews: React.FC<PerformanceReviewsProps> = ({ user }) => {
    const isManager = user.role === UserRole.MANAGER;

    const relevantReviews = isManager
        ? MOCK_REVIEWS.filter(r => r.managerId === user.id)
        : MOCK_REVIEWS.filter(r => r.employeeId === user.id);

    const upcomingReviews = relevantReviews.filter(r => r.status !== 'Completed');
    const completedReviews = relevantReviews.filter(r => r.status === 'Completed');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Performance Reviews</h2>
                {isManager && <Button variant="primary">Create New Review</Button>}
            </div>

            <section>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-text mb-4">Upcoming Reviews ({upcomingReviews.length})</h3>
                {upcomingReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingReviews.map(review => (
                            <ReviewCard key={review.id} review={review} currentUser={user} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-500 dark:text-dark-text-secondary">No upcoming performance reviews.</p>
                    </Card>
                )}
            </section>
            
            <section>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-text mb-4">Completed Reviews ({completedReviews.length})</h3>
                 {completedReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedReviews.map(review => (
                            <ReviewCard key={review.id} review={review} currentUser={user} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-500 dark:text-dark-text-secondary">No completed performance reviews found.</p>
                    </Card>
                )}
            </section>
        </div>
    );
};

export default PerformanceReviews;