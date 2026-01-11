import React, { useState } from 'react';
import { User, WellnessResource } from '../types';
import { MOCK_WELLNESS_RESOURCES } from '../constants';
import Card from './ui/Card';

interface WellnessProps {
  user: User;
}

const ResourceCard: React.FC<{ resource: WellnessResource }> = ({ resource }) => {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <div className="flex-grow">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    resource.category === 'Mental Health' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    resource.category === 'Stress Management' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }`}>
                    {resource.category}
                </span>
                <h4 className="text-lg font-semibold text-brand-dark dark:text-dark-text mt-3">{resource.title}</h4>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-2">{resource.description}</p>
            </div>
            <div className="mt-4">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-primary hover:underline">
                    Access Resource &rarr;
                </a>
            </div>
        </Card>
    );
}

const Wellness: React.FC<WellnessProps> = ({ user }) => {
  const [filter, setFilter] = useState('All');

  const filteredResources = filter === 'All' 
    ? MOCK_WELLNESS_RESOURCES
    : MOCK_WELLNESS_RESOURCES.filter(r => r.category === filter);

  return (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Wellness & Mental Health Hub</h2>
        
        <div className="p-6 bg-gradient-to-r from-brand-light to-blue-50 dark:from-brand-dark dark:to-blue-900 rounded-xl">
            <h3 className="text-xl font-bold text-brand-dark dark:text-dark-text">Your Well-being Matters</h3>
            <p className="text-gray-600 dark:text-dark-text-secondary mt-2 max-w-3xl">
                We are committed to supporting your mental, physical, and emotional health. Explore these confidential resources designed specifically for the challenges and rewards of a career in healthcare.
            </p>
        </div>

        <Card>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-text">Curated Resources</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Filter:</span>
                    {['All', 'Mental Health', 'Stress Management', 'Physical Well-being'].map(category => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === category ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-dark-text dark:hover:bg-gray-500'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
        </Card>
    </div>
  );
};

export default Wellness;