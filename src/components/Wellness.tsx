import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, WellnessResource } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { WellnessIcon } from './ui/icons/Icon';
import Breadcrumbs from './ui/Breadcrumbs';
import EmptyState from './ui/EmptyState';
import { MOCK_WELLNESS_RESOURCES } from '../constants';
import { View } from '../types';

interface WellnessProps {
  user: User;
  setActiveView: (view: View) => void;
}

const Wellness: React.FC<WellnessProps> = ({ user, setActiveView }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [resources] = useState<WellnessResource[]>(MOCK_WELLNESS_RESOURCES);

  // Modal states
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Handlers
  const handleTalkToSomeoneClick = () => {
    setIsChatOpen(true);
  };

  const handleEAPServicesClick = () => navigate('/wellness/eap');

  const handleResourceLearnMoreClick = (resourceId: string) => {
    // Navigate or expand
    console.log(`Learn more about ${resourceId}`);
    navigate(`/wellness/resource/${resourceId}`);
  };

  const handleResourceAccessClick = (resourceId: string) => {
    console.log(`Accessing resource ${resourceId}`);
    alert('Accessing resource...');
  };

  const handleGetSupportClick = () => setIsSupportModalOpen(true);

  const handleViewProgramsClick = () => navigate('/wellness/fitness-programs');

  const handleCallEAPClick = () => {
    window.location.href = 'tel:18001234567';
  };

  const categories = [
    { id: 'all', label: 'All Resources', icon: '🌟' },
    { id: 'mental_health', label: 'Mental Health', icon: '🧠' },
    { id: 'physical_health', label: 'Physical Health', icon: '💪' },
    { id: 'financial', label: 'Financial Wellness', icon: '💰' },
    { id: 'social', label: 'Social Wellness', icon: '👥' },
    { id: 'work_life', label: 'Work-Life Balance', icon: '⚖️' },
  ];

  const filteredResources =
    selectedCategory === 'all' ? resources : resources.filter(r => r.category === selectedCategory);

  const wellnessStats = [
    { label: 'Programs Joined', value: 3, icon: '🎯' },
    { label: 'Resources Used', value: 12, icon: '📚' },
    { label: 'Wellness Score', value: '85%', icon: '⭐' },
    { label: 'Days Active', value: 45, icon: '🔥' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Growth' }, { label: 'Wellness Hub' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-action-primary to-action-primary-hover rounded-xl text-text-inverse">
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
        <div className="absolute inset-0 bg-gradient-to-r from-action-primary/90 to-action-secondary/90" />
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>
        <div className="relative p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Your Wellbeing Matters</h2>
          <p className="text-white/80 max-w-xl">
            Access our comprehensive wellness programs, mental health resources, and Employee
            Assistance Program (EAP) benefits.
          </p>
          <div className="mt-6 flex gap-4">
            <Button
              variant="secondary"
              className="bg-white text-action-primary hover:bg-white/90 border-white shadow-lg"
              onClick={handleTalkToSomeoneClick}
              data-testid="talk-to-someone-button"
            >
              Talk to Someone
            </Button>
            <Button
              variant="secondary"
              className="bg-transparent border-2 border-white text-white hover:bg-white/20"
              onClick={handleEAPServicesClick}
              data-testid="eap-services-button"
            >
              EAP Services
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {wellnessStats.map(stat => (
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
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-action-primary/10 text-action-primary border border-action-primary/20'
                : 'bg-bg-secondary dark:bg-dark-card text-text-secondary dark:text-dark-text-secondary hover:bg-border-light dark:hover:bg-dark-border'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {filteredResources.length === 0 ? (
        <EmptyState
          title="No resources found"
          description={`We couldn't find any wellness resources in the "${selectedCategory.replace('_', ' ')}" category.`}
          actionLabel="View All Resources"
          onAction={() => setSelectedCategory('all')}
          icon="🌿"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card
              key={resource.id}
              variant="bordered"
              className="hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-action-primary/10 rounded-xl text-action-primary">
                  <span className="text-2xl">
                    {resource.category === 'mental_health'
                      ? '🧠'
                      : resource.category === 'physical_health'
                        ? '💪'
                        : resource.category === 'financial'
                          ? '💰'
                          : resource.category === 'social'
                            ? '👥'
                            : '⚖️'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    {resource.description}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full capitalize">
                    {resource.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleResourceLearnMoreClick(resource.id)}
                  data-testid={`learn-more-${resource.id}`}
                >
                  Learn More
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleResourceAccessClick(resource.id)}
                  data-testid={`access-${resource.id}`}
                >
                  Access
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Featured Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mental Health Support */}
        <Card variant="glass">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-status-info/10 rounded-xl text-status-info">
              <span className="text-3xl">🧘</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Mental Health Support
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                Access confidential counseling, stress management tools, and mental wellness
                resources.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <span className="text-status-success">✓</span>
                  Free counseling sessions (up to 8/year)
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <span className="text-status-success">✓</span>
                  24/7 crisis support line
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <span className="text-status-success">✓</span>
                  Meditation app subscription
                </div>
              </div>
              <Button
                className="mt-4"
                onClick={handleGetSupportClick}
                data-testid="get-support-button"
              >
                Get Support
              </Button>
            </div>
          </div>
        </Card>

        {/* Fitness Benefits */}
        <Card variant="glass">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-status-warning/10 rounded-xl text-status-warning">
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
                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <span className="text-status-success">✓</span>
                  Gym membership reimbursement ($50/month)
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <span className="text-status-success">✓</span>
                  Virtual fitness classes
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                  <span className="text-status-success">✓</span>
                  Annual fitness challenge with prizes
                </div>
              </div>
              <Button
                className="mt-4"
                onClick={handleViewProgramsClick}
                data-testid="view-programs-button"
              >
                View Programs
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Schedule Therapy', icon: '📅', color: 'bg-status-info/10 text-status-info' },
            {
              label: 'Meditation',
              icon: '🧘',
              color: 'bg-action-secondary/10 text-action-secondary',
            },
            {
              label: 'Fitness Classes',
              icon: '💪',
              color: 'bg-status-warning/10 text-status-warning',
            },
            {
              label: 'Financial Coach',
              icon: '💰',
              color: 'bg-status-success/10 text-status-success',
            },
          ].map(item => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-2 p-4 ${item.color} rounded-xl hover:opacity-80 transition-opacity`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Emergency Support */}
      <Card variant="elevated" className="border-l-4 border-l-status-error">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Need Immediate Support?</h3>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Our Employee Assistance Program is available 24/7 for crisis support.
            </p>
          </div>
          <Button variant="danger" onClick={handleCallEAPClick} data-testid="call-eap-button">
            Call EAP: 1-800-XXX-XXXX
          </Button>
        </div>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="Get Support"
      >
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Choose a support option:</h3>
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                /* TODO */ setIsSupportModalOpen(false);
              }}
            >
              Schedule Counseling
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                /* TODO */ setIsSupportModalOpen(false);
              }}
            >
              Text with a Coach
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                /* TODO */ setIsSupportModalOpen(false);
              }}
            >
              Self-Guided Resources
            </Button>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsSupportModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
      {/* Support Modals */}
      <Modal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} title="Wellness Support Chat">
        <div className="flex flex-col h-[400px]">
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-bg-secondary dark:bg-dark-card rounded-xl mb-4 border border-border-light dark:border-dark-border">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-action-primary text-text-inverse flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <div className="bg-bg-elevated dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none text-sm text-text-primary dark:text-dark-text shadow-sm max-w-[80%]">
                Hello {user.name.split(' ')[0]}! I&apos;m your wellness assistant. How are you
                feeling today?
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none text-text-primary dark:text-dark-text"
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget;
                  if (input.value) {
                    alert('Message sent! A counselor will be with you shortly.');
                    input.value = '';
                    setIsChatOpen(false);
                  }
                }
              }}
            />
            <Button onClick={() => setIsChatOpen(false)}>Send</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Wellness;
