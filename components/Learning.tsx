import React, { useState, useEffect } from 'react';
import { User, LearningResource } from '../types';
import { MOCK_TRAINING, MOCK_RESOURCES } from '../constants';
import Card from './ui/Card';
import Button from './ui/Button';
import { DocumentIcon, VideoIcon, PresentationIcon, CheckCircleIcon } from './ui/icons/Icon';


interface LearningProps {
  user: User;
}

const ResourceCard: React.FC<{ resource: LearningResource }> = ({ resource }) => {
    const getIcon = () => {
        switch(resource.type) {
            case 'Document': return <DocumentIcon className="w-8 h-8 text-brand-primary" />;
            case 'Video': return <VideoIcon className="w-8 h-8 text-brand-secondary" />;
            case 'Presentation': return <PresentationIcon className="w-8 h-8 text-yellow-500" />;
            default: return null;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{getIcon()}</div>
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-dark-text">{resource.title}</h4>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline">
                        Open Resource
                    </a>
                </div>
            </div>
        </Card>
    )
}


const Learning: React.FC<LearningProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'training' | 'library'>('training');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const totalPoints = MOCK_TRAINING.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    MOCK_TRAINING.forEach(module => {
      if (module.type === 'Mandatory' && !module.completed && module.dueDate) {
        const dueDate = new Date(module.dueDate);
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays <= 3) {
          console.warn(`Notification: Mandatory training "${module.title}" is due in ${diffDays} day(s).`);
          // In a real app, this would trigger a more robust notification system.
        }
      }
    });
  }, []); // Empty dependency array means this runs once on mount.

  const getDueDateInfo = (dueDateStr?: string, completed?: boolean): { text: string; className: string } | null => {
      if (!dueDateStr || completed) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(dueDateStr);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
          return { text: `Overdue by ${Math.abs(diffDays)} days`, className: 'text-red-600 dark:text-red-400 font-semibold' };
      }
      if (diffDays >= 0 && diffDays <= 3) {
          return { text: `Due in ${diffDays} days`, className: 'text-yellow-600 dark:text-yellow-400 font-semibold' };
      }
      return { text: `Due: ${dueDateStr}`, className: 'text-gray-500 dark:text-gray-400' };
  };
  
  const filteredResources = MOCK_RESOURCES
      .filter(res => filterType === 'All' || res.type === filterType)
      .filter(res => res.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Learning & Development</h2>

      <div className="border-b border-gray-200 dark:border-dark-border">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('training')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'training'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:border-gray-500'
            }`}
          >
            My Training
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'library'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:border-gray-500'
            }`}
          >
            Resource Library
          </button>
        </nav>
      </div>

      {activeTab === 'training' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-brand-dark dark:text-dark-text">Gamified Learning</h3>
                <p className="text-gray-600 dark:text-dark-text-secondary mt-1">Earn points by completing training modules and climb the leaderboard!</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{totalPoints}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Total Points Earned</p>
              </div>
            </div>
          </Card>
          <Card title="My Training Assignments">
              <ul className="divide-y divide-gray-200 dark:divide-dark-border">
                  {MOCK_TRAINING.map(module => (
                      <li key={module.id} className="py-4 flex justify-between items-center">
                          <div>
                              <p className={`font-medium ${module.completed ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-dark-text'}`}>{module.title}</p>
                              <div className="flex items-center text-sm mt-1">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${module.type === 'Mandatory' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                                      {module.type}
                                  </span>
                                  {(() => {
                                      const dueDateInfo = getDueDateInfo(module.dueDate, module.completed);
                                      if (dueDateInfo) {
                                          return <p className={`ml-4 ${dueDateInfo.className}`}>{dueDateInfo.text}</p>;
                                      }
                                      return null;
                                  })()}
                              </div>
                          </div>
                          <div className="flex items-center space-x-4">
                              <span className="font-bold text-lg text-purple-600 dark:text-purple-400">+{module.points} pts</span>
                              {module.completed ? (
                                  <span className="flex items-center text-status-success font-semibold">
                                      <CheckCircleIcon className="w-6 h-6 mr-1"/> Completed
                                  </span>
                              ) : (
                                  <Button variant="primary" onClick={() => window.open(module.url, '_blank')}>Start Training</Button>
                              )}
                          </div>
                      </li>
                  ))}
              </ul>
          </Card>
        </div>
      )}

      {activeTab === 'library' && (
        <div>
            <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-card rounded-lg flex items-center space-x-4 border border-gray-200 dark:border-dark-border">
                <input
                    type="text"
                    placeholder="Search resources by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
                />
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Filter by:</span>
                    {['All', 'Document', 'Video', 'Presentation'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${filterType === type ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-dark-text dark:hover:bg-gray-500'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-text mb-4">Practice Resources ({filteredResources.length})</h3>
            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(res => (
                        <ResourceCard key={res.id} resource={res} />
                    ))}
                </div>
            ) : (
                <Card>
                    <p className="text-center text-gray-500 dark:text-dark-text-secondary">No resources found matching your criteria.</p>
                </Card>
            )}
        </div>
      )}
    </div>
  );
};

export default Learning;
