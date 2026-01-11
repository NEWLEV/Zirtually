import React, { useState } from 'react';
import { User } from '../types';
import { useIndustry } from '../App';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Icon } from './ui/icons/Icon';

interface MyJourneyProps {
  user: User;
}

interface JourneyMilestone {
  id: string;
  type: 'onboarding' | 'training' | 'promotion' | 'achievement' | 'review' | 'certification' | 'anniversary' | 'project' | 'recognition';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  icon: string;
  category: string;
  details?: {
    label: string;
    value: string;
  }[];
}

interface CareerPath {
  id: string;
  title: string;
  level: number;
  description: string;
  requirements: string[];
  status: 'completed' | 'current' | 'future';
  salary_range?: string;
}

const MOCK_MILESTONES: JourneyMilestone[] = [
  {
    id: '1',
    type: 'onboarding',
    title: 'Welcome Aboard!',
    description: 'Successfully completed the onboarding process and joined the team.',
    date: '2023-01-15',
    status: 'completed',
    icon: 'rocket',
    category: 'Getting Started',
    details: [
      { label: 'Department', value: 'Engineering' },
      { label: 'Manager', value: 'Sarah Chen' },
    ],
  },
  {
    id: '2',
    type: 'training',
    title: 'Completed Security Training',
    description: 'Finished mandatory security awareness and compliance training.',
    date: '2023-01-22',
    status: 'completed',
    icon: 'shield',
    category: 'Training & Development',
  },
  {
    id: '3',
    type: 'project',
    title: 'First Project Milestone',
    description: 'Successfully delivered first major project contribution.',
    date: '2023-03-10',
    status: 'completed',
    icon: 'briefcase',
    category: 'Projects',
    details: [
      { label: 'Project', value: 'Customer Portal Redesign' },
      { label: 'Role', value: 'Lead Developer' },
    ],
  },
  {
    id: '4',
    type: 'certification',
    title: 'AWS Certified',
    description: 'Earned AWS Solutions Architect certification.',
    date: '2023-05-20',
    status: 'completed',
    icon: 'award',
    category: 'Certifications',
    details: [
      { label: 'Certification', value: 'AWS Solutions Architect' },
      { label: 'Valid Until', value: '2026-05-20' },
    ],
  },
  {
    id: '5',
    type: 'review',
    title: 'First Performance Review',
    description: 'Completed 6-month performance review with positive feedback.',
    date: '2023-07-15',
    status: 'completed',
    icon: 'clipboard',
    category: 'Performance',
    details: [
      { label: 'Rating', value: 'Exceeds Expectations' },
      { label: 'Manager', value: 'Sarah Chen' },
    ],
  },
  {
    id: '6',
    type: 'recognition',
    title: 'Innovation Award',
    description: 'Recognized for innovative solution to customer onboarding.',
    date: '2023-09-01',
    status: 'completed',
    icon: 'star',
    category: 'Recognition',
  },
  {
    id: '7',
    type: 'anniversary',
    title: '1 Year Anniversary',
    description: 'Celebrating one year with the company!',
    date: '2024-01-15',
    status: 'completed',
    icon: 'cake',
    category: 'Milestones',
  },
  {
    id: '8',
    type: 'promotion',
    title: 'Promoted to Senior Developer',
    description: 'Recognized for consistent excellence and promoted to senior role.',
    date: '2024-02-01',
    status: 'completed',
    icon: 'trending-up',
    category: 'Career Growth',
    details: [
      { label: 'Previous Role', value: 'Software Developer' },
      { label: 'New Role', value: 'Senior Software Developer' },
    ],
  },
  {
    id: '9',
    type: 'training',
    title: 'Leadership Fundamentals',
    description: 'Currently enrolled in leadership development program.',
    date: '2024-06-01',
    status: 'in_progress',
    icon: 'users',
    category: 'Training & Development',
    details: [
      { label: 'Progress', value: '60% Complete' },
      { label: 'Expected Completion', value: '2024-08-15' },
    ],
  },
  {
    id: '10',
    type: 'review',
    title: 'Annual Performance Review',
    description: 'Upcoming annual performance review scheduled.',
    date: '2024-07-15',
    status: 'upcoming',
    icon: 'calendar',
    category: 'Performance',
  },
];

const MOCK_CAREER_PATH: CareerPath[] = [
  {
    id: '1',
    title: 'Junior Developer',
    level: 1,
    description: 'Entry-level position focusing on learning and growth.',
    requirements: ['Bachelor\'s degree or equivalent', 'Basic programming skills'],
    status: 'completed',
  },
  {
    id: '2',
    title: 'Software Developer',
    level: 2,
    description: 'Independent contributor with growing expertise.',
    requirements: ['2+ years experience', 'Proficient in core technologies', 'Can work independently'],
    status: 'completed',
  },
  {
    id: '3',
    title: 'Senior Software Developer',
    level: 3,
    description: 'Technical expert who mentors others and leads projects.',
    requirements: ['5+ years experience', 'Technical leadership', 'Mentorship experience'],
    status: 'current',
    salary_range: '$120,000 - $150,000',
  },
  {
    id: '4',
    title: 'Staff Engineer',
    level: 4,
    description: 'Strategic technical leader driving architecture decisions.',
    requirements: ['8+ years experience', 'System design expertise', 'Cross-team influence'],
    status: 'future',
    salary_range: '$150,000 - $180,000',
  },
  {
    id: '5',
    title: 'Principal Engineer',
    level: 5,
    description: 'Organization-wide technical visionary.',
    requirements: ['12+ years experience', 'Industry recognition', 'Strategic impact'],
    status: 'future',
    salary_range: '$180,000 - $220,000',
  },
];

export const MyJourney: React.FC<MyJourneyProps> = ({ user }) => {
  const { config } = useIndustry();
  const [activeTab, setActiveTab] = useState<'timeline' | 'career' | 'achievements'>('timeline');
  const [selectedMilestone, setSelectedMilestone] = useState<JourneyMilestone | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...new Set(MOCK_MILESTONES.map(m => m.category))];
  
  const filteredMilestones = filterCategory === 'all' 
    ? MOCK_MILESTONES 
    : MOCK_MILESTONES.filter(m => m.category === filterCategory);

  const completedCount = MOCK_MILESTONES.filter(m => m.status === 'completed').length;
  const inProgressCount = MOCK_MILESTONES.filter(m => m.status === 'in_progress').length;
  const upcomingCount = MOCK_MILESTONES.filter(m => m.status === 'upcoming').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-400';
      case 'current': return 'bg-indigo-500';
      case 'future': return 'bg-gray-300';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'upcoming': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'current': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'future': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
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
    const startDate = new Date('2023-01-15');
    const now = new Date();
    const years = Math.floor((now.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(((now.getTime() - startDate.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    return { years, months };
  };

  const tenure = calculateTenure();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Journey at {config.name}</h1>
              <p className="text-white/80">{user.title} • {tenure.years} years, {tenure.months} months</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{completedCount}</div>
              <div className="text-sm text-white/80">Milestones Achieved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{inProgressCount}</div>
              <div className="text-sm text-white/80">In Progress</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{upcomingCount}</div>
              <div className="text-sm text-white/80">Upcoming</div>
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
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Filter by Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      filterCategory === category
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
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
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

              {/* Milestones */}
              <div className="space-y-6">
                {filteredMilestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full ${getStatusColor(milestone.status)} flex items-center justify-center text-white shadow-lg`}>
                      <Icon name={getTypeIcon(milestone.type)} size={24} />
                    </div>

                    {/* Content */}
                    <Card
                      variant="bordered"
                      className="flex-1 p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedMilestone(milestone)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(milestone.date)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(milestone.status)}`}>
                          {milestone.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{milestone.description}</p>
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Your Career Progression</h2>
            
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-b from-green-500 via-indigo-500 to-indigo-500 transition-all"
                  style={{ height: `${((MOCK_CAREER_PATH.findIndex(p => p.status === 'current') + 1) / MOCK_CAREER_PATH.length) * 100}%` }}
                />
              </div>

              {/* Career steps */}
              <div className="space-y-8">
                {MOCK_CAREER_PATH.map((step, index) => (
                  <div key={step.id} className="relative flex gap-6">
                    {/* Step indicator */}
                    <div className={`relative z-10 w-12 h-12 rounded-full ${getStatusColor(step.status)} flex items-center justify-center text-white font-bold shadow-lg ${step.status === 'current' ? 'ring-4 ring-indigo-200 dark:ring-indigo-800' : ''}`}>
                      {step.status === 'completed' ? (
                        <Icon name="check" size={24} />
                      ) : (
                        <span>{step.level}</span>
                      )}
                    </div>

                    {/* Content */}
                    <Card
                      variant={step.status === 'current' ? 'elevated' : 'bordered'}
                      className={`flex-1 p-4 ${step.status === 'current' ? 'ring-2 ring-indigo-500' : ''} ${step.status === 'future' ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                          {step.salary_range && (
                            <p className="text-sm text-green-600 dark:text-green-400">{step.salary_range}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(step.status)}`}>
                          {step.status === 'current' ? 'Current Role' : step.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{step.description}</p>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Requirements:</p>
                        <ul className="space-y-1">
                          {step.requirements.map((req, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                              <Icon 
                                name={step.status === 'completed' || step.status === 'current' ? 'check-circle' : 'circle'} 
                                size={14} 
                                className={step.status === 'completed' || step.status === 'current' ? 'text-green-500' : 'text-gray-400'}
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
          <Card variant="bordered" className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Icon name="lightbulb" size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Next Steps for Your Career</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Complete the Leadership Fundamentals program to prepare for Staff Engineer role</li>
                  <li>• Mentor 2-3 junior developers to demonstrate leadership capabilities</li>
                  <li>• Lead a cross-team architecture initiative</li>
                  <li>• Consider obtaining additional cloud certifications (GCP, Azure)</li>
                </ul>
                <Button variant="outline" size="sm" className="mt-4">
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earned Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'First Week Champion', icon: 'rocket', color: 'from-blue-500 to-cyan-500', earned: true },
                { name: 'Quick Learner', icon: 'zap', color: 'from-yellow-500 to-orange-500', earned: true },
                { name: 'Team Player', icon: 'users', color: 'from-green-500 to-emerald-500', earned: true },
                { name: 'Innovation Star', icon: 'star', color: 'from-purple-500 to-pink-500', earned: true },
                { name: 'Mentor', icon: 'heart', color: 'from-red-500 to-rose-500', earned: true },
                { name: 'Cloud Expert', icon: 'cloud', color: 'from-indigo-500 to-blue-500', earned: true },
                { name: 'Security Champion', icon: 'shield', color: 'from-gray-500 to-slate-500', earned: false },
                { name: 'Leadership', icon: 'crown', color: 'from-amber-500 to-yellow-500', earned: false },
              ].map(badge => (
                <div key={badge.name} className={`text-center ${!badge.earned ? 'opacity-40' : ''}`}>
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-lg mb-2`}>
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Recognition</h2>
            <div className="space-y-4">
              {[
                { from: 'Sarah Chen', message: 'Outstanding work on the customer portal redesign. Your attention to detail and user-first approach made a real difference!', date: '2024-01-10' },
                { from: 'Engineering Team', message: 'Thank you for mentoring our new team members. Your patience and knowledge sharing is invaluable.', date: '2023-11-15' },
                { from: 'CEO Office', message: 'Innovation Award recipient for Q3 2023. Your solution reduced customer onboarding time by 40%.', date: '2023-09-01' },
              ].map((recognition, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                    <Icon name="heart" size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">From: {recognition.from}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(recognition.date)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">"{recognition.message}"</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Milestone Detail Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMilestone(null)}>
          <Card variant="elevated" className="w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${getStatusColor(selectedMilestone.status)} flex items-center justify-center text-white`}>
                  <Icon name={getTypeIcon(selectedMilestone.type)} size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMilestone.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(selectedMilestone.date)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMilestone(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <Icon name="x" size={24} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedMilestone.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedMilestone.status)}`}>
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
                      <span className="text-gray-900 dark:text-white font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedMilestone(null)}>
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
