import React, { useState } from 'react';
import { User, WellnessResource } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import { WellnessIcon } from './ui/icons/Icon';
import { MOCK_WELLNESS_RESOURCES } from '../constants';

interface WellnessProps {
  user: User;
}

const Wellness: React.FC<WellnessProps> = ({ user }) => {
  const { config } = useIndustry();
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [resources] = useState<WellnessResource[]>(MOCK_WELLNESS_RESOURCES);

  const categories = [
    { id: 'all', label: 'All Resources', icon: '🌟' },
    { id: 'mental_health', label: 'Mental Health', icon: '🧠' },
    { id: 'physical_health', label: 'Physical Health', icon: '💪' },
    { id: 'financial', label: 'Financial Wellness', icon: '💰' },
    { id: 'social', label: 'Social Wellness', icon: '👥' },
    { id: 'work_life', label: 'Work-Life Balance', icon: '⚖️' },
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  const wellnessStats = [
    { label: 'Programs Joined', value: 3, icon: '🎯' },
    { label: 'Resources Used', value: 12, icon: '📚' },
    { label: 'Wellness Score', value: '85%', icon: '⭐' },
    { label: 'Days Active', value: 45, icon: '🔥' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
              <WellnessIcon className="w-6 h-6" />
            </div>
            Wellness Hub
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Resources to support your physical, mental, and financial wellbeing
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <Card variant="glass" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-600/90" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>
        <div className="relative p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Your Wellbeing Matters</h2>
          <p className="text-white/80 max-w-xl">
            Access our comprehensive wellness programs, mental health resources, and Employee Assistance Program (EAP) benefits.
          </p>
          <div className="mt-6 flex gap-4">
            <Button className="bg-white text-green-700 hover:bg-white/90">
              Talk to Someone
            </Button>
            <Button variant="secondary" className="border-white/30 text-white hover:bg-white/10">
              EAP Services
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wellnessStats.map((stat) => (
          <Card key={stat.label} variant="bordered" padding="md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card 
            key={resource.id} 
            variant="bordered"
            className="hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <span className="text-2xl">
                  {resource.category === 'mental_health' ? '🧠' :
                   resource.category === 'physical_health' ? '💪' :
                   resource.category === 'financial' ? '💰' :
                   resource.category === 'social' ? '👥' : '⚖️'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{resource.description}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full capitalize">
                  {resource.category.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                Learn More
              </Button>
              <Button size="sm" className="flex-1">
                Access
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mental Health Support */}
        <Card variant="glass">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <span className="text-3xl">🧘</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Mental Health Support
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Access confidential counseling, stress management tools, and mental wellness resources.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Free counseling sessions (up to 8/year)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  24/7 crisis support line
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Meditation app subscription
                </div>
              </div>
              <Button className="mt-4">Get Support</Button>
            </div>
          </div>
        </Card>

        {/* Fitness Benefits */}
        <Card variant="glass">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <span className="text-3xl">🏃</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fitness & Physical Health
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Stay active with gym memberships, fitness classes, and wellness challenges.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Gym membership reimbursement ($50/month)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Virtual fitness classes
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <span className="text-green-500">✓</span>
                  Annual fitness challenge with prizes
                </div>
              </div>
              <Button className="mt-4">View Programs</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Access
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Schedule Therapy', icon: '📅', color: 'bg-purple-100 dark:bg-purple-900/30' },
            { label: 'Meditation', icon: '🧘', color: 'bg-blue-100 dark:bg-blue-900/30' },
            { label: 'Fitness Classes', icon: '💪', color: 'bg-orange-100 dark:bg-orange-900/30' },
            { label: 'Financial Coach', icon: '💰', color: 'bg-green-100 dark:bg-green-900/30' },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-2 p-4 ${item.color} rounded-xl hover:opacity-80 transition-opacity`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Emergency Support */}
      <Card variant="elevated" className="border-l-4 border-l-red-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Need Immediate Support?
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Our Employee Assistance Program is available 24/7 for crisis support.
            </p>
          </div>
          <Button variant="danger">
            Call EAP: 1-800-XXX-XXXX
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Wellness;
