import React, { useState } from 'react';
import { User, View, JourneyMilestone } from '../types';
import { useIndustry } from '../App';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Icon } from './ui/icons/Icon';
import Breadcrumbs from './ui/Breadcrumbs';
import { MOCK_MILESTONES, MOCK_CAREER_PATH } from '../constants';

interface MyJourneyProps {
  user: User;
  setActiveView?: (view: View) => void;
}

export const MyJourney: React.FC<MyJourneyProps> = ({ user, setActiveView }) => {
  const { config } = useIndustry();
  const [activeTab, setActiveTab] = useState<'timeline' | 'career' | 'achievements'>('timeline');
  const [selectedMilestone, setSelectedMilestone] = useState<JourneyMilestone | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...new Set(MOCK_MILESTONES.map(m => m.category))];

  const filteredMilestones =
    filterCategory === 'all'
      ? MOCK_MILESTONES
      : MOCK_MILESTONES.filter(m => m.category === filterCategory);

  const completedCount = MOCK_MILESTONES.filter(m => m.status === 'completed').length;
  const inProgressCount = MOCK_MILESTONES.filter(m => m.status === 'in_progress').length;
  const upcomingCount = MOCK_MILESTONES.filter(m => m.status === 'upcoming').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-400';
      case 'current':
        return 'bg-indigo-500';
      case 'future':
        return 'bg-gray-300';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'current':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'future':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      onboarding: 'rocket',
      training: 'book-open',
      promotion: 'trending-up',
      achievement: 'trophy',
      review: 'clipboard',
      certification: 'award',
      anniversary: 'gift',
      project: 'briefcase',
      recognition: 'star',
    };
    return icons[type] || 'circle';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateTenure = () => {
    const startDate = user.startDate ? new Date(user.startDate) : new Date();
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - startDate.getTime());
    const years = Math.floor(diffTime / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(
      (diffTime % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000)
    );
    return { years, months };
  };

  const tenure = calculateTenure();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Career' }, { label: 'My Journey' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-action-primary via-action-secondary to-focus-ring p-8 text-text-inverse shadow-xl shadow-action-primary/20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {user.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Journey at {config.name}</h1>
              <p className="opacity-90">
                {user.title} • {tenure.years} years, {tenure.months} months
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/5">
              <div className="text-3xl font-bold">{completedCount}</div>
              <div className="text-sm opacity-80">Milestones Achieved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/5">
              <div className="text-3xl font-bold">{inProgressCount}</div>
              <div className="text-sm opacity-80">In Progress</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/5">
              <div className="text-3xl font-bold">{upcomingCount}</div>
              <div className="text-sm opacity-80">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'timeline', label: 'Timeline', icon: 'clock' },
          { id: 'career', label: 'Career Path', icon: 'trending-up' },
          { id: 'achievements', label: 'Achievements', icon: 'trophy' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-action-primary text-action-primary bg-action-primary/5'
                : 'border-transparent text-text-tertiary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Filter by Category
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm border-l-4 ${
                      filterCategory === category
                        ? 'bg-action-primary/10 text-action-primary border-action-primary shadow-sm'
                        : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:bg-bg-secondary dark:hover:bg-dark-border/50'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border-light dark:bg-dark-border" />

              {/* Milestones */}
              <div className="space-y-6">
                {filteredMilestones.map(milestone => (
                  <div key={milestone.id} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full ${getStatusColor(milestone.status)} flex items-center justify-center text-text-inverse shadow-lg shrink-0`}
                    >
                      <Icon name={getTypeIcon(milestone.type)} size={18} />
                    </div>

                    {/* Content */}
                    <Card
                      variant="bordered"
                      className="flex-1 p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedMilestone(milestone)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-text-primary dark:text-dark-text">
                            {milestone.title}
                          </h3>
                          <p className="text-xs text-text-tertiary dark:text-dark-text-secondary">
                            {formatDate(milestone.date)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(milestone.status)}`}
                        >
                          {milestone.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-text-secondary dark:text-dark-text text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-bold bg-bg-secondary dark:bg-dark-border text-action-primary px-2 py-1 rounded-md border border-action-primary/10">
                          {milestone.category}
                        </span>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Path Tab */}
      {activeTab === 'career' && (
        <div className="space-y-6">
          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Your Career Progression
            </h2>

            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-bg-secondary dark:bg-dark-border rounded-full overflow-hidden">
                <div
                  className="w-full bg-gradient-to-b from-action-primary via-action-secondary to-action-secondary transition-all"
                  style={{
                    height: `${((MOCK_CAREER_PATH.findIndex(p => p.status === 'current') + 1) / MOCK_CAREER_PATH.length) * 100}%`,
                  }}
                />
              </div>

              {/* Career steps */}
              <div className="space-y-8">
                {MOCK_CAREER_PATH.map(step => (
                  <div key={step.id} className="relative flex gap-6">
                    {/* Step indicator */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full ${getStatusColor(step.status)} flex items-center justify-center text-text-inverse font-bold shadow-lg ${step.status === 'current' ? 'ring-4 ring-action-primary/20' : ''}`}
                    >
                      {step.status === 'completed' ? (
                        <Icon name="check" size={20} />
                      ) : (
                        <span>{step.level}</span>
                      )}
                    </div>

                    {/* Content */}
                    <Card
                      variant={step.status === 'current' ? 'elevated' : 'bordered'}
                      className={`flex-1 p-4 ${step.status === 'current' ? 'ring-2 ring-action-primary' : ''} ${step.status === 'future' ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-text-primary dark:text-dark-text">
                            {step.title}
                          </h3>
                          {step.salary_range && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              {step.salary_range}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(step.status)}`}
                        >
                          {step.status === 'current' ? 'Current Role' : step.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {step.description}
                      </p>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Requirements:
                        </p>
                        <ul className="space-y-1">
                          {step.requirements.map((req, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
                            >
                              <Icon
                                name={
                                  step.status === 'completed' || step.status === 'current'
                                    ? 'check-circle'
                                    : 'circle'
                                }
                                size={14}
                                className={
                                  step.status === 'completed' || step.status === 'current'
                                    ? 'text-green-500'
                                    : 'text-gray-400'
                                }
                              />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Career Tips */}
          <Card
            variant="bordered"
            className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Icon name="lightbulb" size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Next Steps for Your Career
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>
                    • Complete the Leadership Fundamentals program to prepare for Staff Engineer
                    role
                  </li>
                  <li>• Mentor 2-3 junior developers to demonstrate leadership capabilities</li>
                  <li>• Lead a cross-team architecture initiative</li>
                  <li>• Consider obtaining additional cloud certifications (GCP, Azure)</li>
                </ul>
                <Button variant="secondary" size="sm" className="mt-4">
                  <Icon name="calendar" size={16} className="mr-2" />
                  Schedule Career Discussion
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Achievement Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Certifications', value: 3, icon: 'award', color: 'text-yellow-500' },
              { label: 'Projects Completed', value: 12, icon: 'briefcase', color: 'text-blue-500' },
              { label: 'Recognition Awards', value: 2, icon: 'star', color: 'text-purple-500' },
              { label: 'Training Completed', value: 8, icon: 'book-open', color: 'text-green-500' },
            ].map(stat => (
              <Card key={stat.label} variant="bordered" className="p-4 text-center">
                <Icon name={stat.icon} size={24} className={`mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Badges */}
          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Earned Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                {
                  name: 'First Week Champion',
                  icon: 'rocket',
                  color: 'from-blue-500 to-cyan-500',
                  earned: true,
                },
                {
                  name: 'Quick Learner',
                  icon: 'zap',
                  color: 'from-yellow-500 to-orange-500',
                  earned: true,
                },
                {
                  name: 'Team Player',
                  icon: 'users',
                  color: 'from-green-500 to-emerald-500',
                  earned: true,
                },
                {
                  name: 'Innovation Star',
                  icon: 'star',
                  color: 'from-purple-500 to-pink-500',
                  earned: true,
                },
                { name: 'Mentor', icon: 'heart', color: 'from-red-500 to-rose-500', earned: true },
                {
                  name: 'Cloud Expert',
                  icon: 'cloud',
                  color: 'from-indigo-500 to-blue-500',
                  earned: true,
                },
                {
                  name: 'Security Champion',
                  icon: 'shield',
                  color: 'from-gray-500 to-slate-500',
                  earned: false,
                },
                {
                  name: 'Leadership',
                  icon: 'crown',
                  color: 'from-amber-500 to-yellow-500',
                  earned: false,
                },
              ].map(badge => (
                <div
                  key={badge.name}
                  className={`text-center ${!badge.earned ? 'opacity-40' : ''}`}
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-lg mb-2`}
                  >
                    <Icon name={badge.icon} size={28} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{badge.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {badge.earned ? 'Earned' : 'Locked'}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Recognition */}
          <Card variant="bordered" className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Recognition
            </h2>
            <div className="space-y-4">
              {[
                {
                  from: 'Sarah Chen',
                  message:
                    'Outstanding work on the customer portal redesign. Your attention to detail and user-first approach made a real difference!',
                  date: '2024-01-10',
                },
                {
                  from: 'Engineering Team',
                  message:
                    'Thank you for mentoring our new team members. Your patience and knowledge sharing is invaluable.',
                  date: '2023-11-15',
                },
                {
                  from: 'CEO Office',
                  message:
                    'Innovation Award recipient for Q3 2023. Your solution reduced customer onboarding time by 40%.',
                  date: '2023-09-01',
                },
              ].map((recognition, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                    <Icon name="heart" size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        From: {recognition.from}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(recognition.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      &quot;{recognition.message}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMilestone(null)}
        >
          <Card
            variant="elevated"
            className="w-full max-w-lg p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${getStatusColor(selectedMilestone.status)} flex items-center justify-center text-white`}
                >
                  <Icon name={getTypeIcon(selectedMilestone.type)} size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedMilestone.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(selectedMilestone.date)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <Icon name="x" size={24} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedMilestone.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedMilestone.status)}`}
              >
                {selectedMilestone.status.replace('_', ' ')}
              </span>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                {selectedMilestone.category}
              </span>
            </div>

            {selectedMilestone.details && selectedMilestone.details.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Details</h3>
                <div className="space-y-2">
                  {selectedMilestone.details.map((detail, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{detail.label}</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedMilestone(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyJourney;
