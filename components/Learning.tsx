import React, { useState } from 'react';
import { User, TrainingModule, LearningResource } from '../types';
import { MOCK_TRAINING, MOCK_RESOURCES } from '../constants';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface LearningProps {
  user: User;
}

const ResourceIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons = {
    Document: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Video: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Presentation: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    Course: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    Article: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  };
  return icons[type as keyof typeof icons] || icons.Document;
};

const getDueDateInfo = (dueDate?: string, completed?: boolean) => {
  if (!dueDate || completed) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff < 0) return { text: 'Overdue', class: 'text-rose-600 dark:text-rose-400', urgent: true };
  if (diff <= 3) return { text: `${diff}d left`, class: 'text-amber-600 dark:text-amber-400', urgent: true };
  return { text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), class: 'text-gray-500 dark:text-slate-400', urgent: false };
};

const Learning: React.FC<LearningProps> = ({ user }) => {
  const { config } = useIndustry();
  const [activeTab, setActiveTab] = useState<'training' | 'library'>('training');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const totalPoints = MOCK_TRAINING.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);
  const completedModules = MOCK_TRAINING.filter(t => t.completed).length;
  const pendingMandatory = MOCK_TRAINING.filter(t => t.type === 'Mandatory' && !t.completed).length;

  const filteredResources = MOCK_RESOURCES.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || res.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const resourceTypes = ['all', ...Array.from(new Set(MOCK_RESOURCES.map(r => r.type)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning & Development</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">
          Grow your skills and advance your career.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-violet-100 text-sm">Total Points</p>
              <p className="text-2xl font-bold">{totalPoints}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-emerald-100 text-sm">Completed</p>
              <p className="text-2xl font-bold">{completedModules}</p>
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${pendingMandatory > 0 ? 'from-amber-500 to-orange-600' : 'from-blue-500 to-indigo-600'} rounded-2xl p-6 text-white`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={pendingMandatory > 0 ? 'text-amber-100' : 'text-blue-100'} style={{ fontSize: '0.875rem' }}>Mandatory</p>
              <p className="text-2xl font-bold">{pendingMandatory > 0 ? pendingMandatory : '✓'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-cyan-100 text-sm">Resources</p>
              <p className="text-2xl font-bold">{MOCK_RESOURCES.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('training')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'training'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400'
            }`}
          >
            My Training
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'library'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400'
            }`}
          >
            Resource Library
          </button>
        </nav>
      </div>

      {activeTab === 'training' && (
        <div className="space-y-4">
          {MOCK_TRAINING.map(module => {
            const dueDateInfo = getDueDateInfo(module.dueDate, module.completed);
            
            return (
              <div
                key={module.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  module.completed
                    ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                }`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  module.completed
                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                    : module.type === 'Mandatory'
                      ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
                      : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                }`}>
                  {module.completed ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${module.completed ? 'text-gray-500 dark:text-slate-400' : 'text-gray-900 dark:text-white'}`}>
                      {module.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      module.type === 'Mandatory'
                        ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                        : module.type === 'Recommended'
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    }`}>
                      {module.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {module.duration && <span>{module.duration} min</span>}
                    {module.category && <span>{module.category}</span>}
                    {dueDateInfo && (
                      <span className={dueDateInfo.class}>{dueDateInfo.text}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-bold text-violet-600 dark:text-violet-400">+{module.points}</span>
                    <p className="text-xs text-gray-500 dark:text-slate-400">points</p>
                  </div>
                  {module.completed ? (
                    <span className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                      Completed
                    </span>
                  ) : (
                    <Button variant="primary" onClick={() => window.open(module.url, '_blank')}>
                      Start Training
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'library' && (
        <div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {resourceTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                    filterType === type
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <Card key={resource.id}>
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    resource.type === 'Video' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400' :
                    resource.type === 'Document' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                    resource.type === 'Course' ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400' :
                    'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                  }`}>
                    <ResourceIcon type={resource.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {resource.type} {resource.duration && `• ${resource.duration} min`}
                    </p>
                    {resource.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => window.open(resource.url, '_blank')}>
                  Open Resource
                </Button>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>No resources found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Learning;
