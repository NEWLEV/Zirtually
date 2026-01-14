import React, { useState } from 'react';
import { BenefitPlan, EnrollmentStatus, User, View } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { BenefitsIcon, CheckCircleIcon } from './ui/icons/Icon';
import { MOCK_BENEFITS } from '../constants';

interface BenefitsProps {
  user: User;
  setActiveView?: (view: View) => void;
}

const Benefits: React.FC<BenefitsProps> = () => {
  const [benefits] = useState<BenefitPlan[]>(MOCK_BENEFITS);
  const [, setSelectedBenefit] = useState<BenefitPlan | null>(null);

  const enrolledBenefits = benefits.filter(b => b.enrollmentStatus === 'enrolled');
  const availableBenefits = benefits.filter(b => b.enrollmentStatus === 'eligible');

  const getStatusColor = (status: EnrollmentStatus) => {
    switch (status) {
      case 'enrolled':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'eligible':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'not_eligible':
        return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health':
        return '🏥';
      case 'dental':
        return '🦷';
      case 'vision':
        return '👓';
      case 'life':
        return '🛡️';
      case 'disability':
        return '♿';
      case 'retirement':
        return '🏦';
      case 'other':
        return '📦';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl text-white">
              <BenefitsIcon className="w-6 h-6" />
            </div>
            Benefits
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage your benefits and enrollment
          </p>
        </div>
        <Button>Open Enrollment</Button>
      </div>

      {/* Benefits Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {enrolledBenefits.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Enrolled Benefits</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {availableBenefits.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Available to Enroll</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <span className="text-xl">📅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Mar 1</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Next Open Enrollment</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Open Enrollment Banner */}
      <Card
        variant="elevated"
        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Open Enrollment Coming Soon!</h3>
            <p className="text-white/80 mt-1">
              Review your current benefits and make changes starting March 1st.
            </p>
          </div>
          <Button className="bg-white text-indigo-700 hover:bg-white/90">Preview Changes</Button>
        </div>
      </Card>

      {/* Current Benefits */}
      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Current Benefits
        </h3>
        <div className="space-y-4">
          {enrolledBenefits.map(benefit => (
            <div
              key={benefit.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => setSelectedBenefit(benefit)}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getCategoryIcon(benefit.category)}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{benefit.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{benefit.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${benefit.employeeCost}/mo
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Your cost</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${getStatusColor(benefit.enrollmentStatus)}`}
                >
                  Enrolled
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Available Benefits */}
      {availableBenefits.length > 0 && (
        <Card variant="bordered">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBenefits.map(benefit => (
              <div
                key={benefit.id}
                className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => setSelectedBenefit(benefit)}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{getCategoryIcon(benefit.category)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{benefit.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {benefit.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm">
                        <span className="text-gray-500 dark:text-slate-400">From </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${benefit.employeeCost}/mo
                        </span>
                      </p>
                      <Button size="sm" variant="secondary">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Benefit Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { id: 'health', label: 'Medical', icon: '🏥', count: 2 },
          { id: 'dental', label: 'Dental', icon: '🦷', count: 1 },
          { id: 'vision', label: 'Vision', icon: '👓', count: 1 },
          { id: 'life', label: 'Life Insurance', icon: '🛡️', count: 1 },
          { id: 'retirement', label: '401(k)', icon: '🏦', count: 1 },
          { id: 'other', label: 'Other', icon: '📦', count: 3 },
        ].map(cat => (
          <Card
            key={cat.id}
            variant="glass"
            padding="sm"
            className="text-center cursor-pointer hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">{cat.icon}</span>
            <p className="font-medium text-gray-900 dark:text-white mt-2">{cat.label}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {cat.count} plan{cat.count !== 1 ? 's' : ''}
            </p>
          </Card>
        ))}
      </div>

      {/* Resources */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Benefits Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-2xl">📄</span>
            <h4 className="font-medium text-gray-900 dark:text-white mt-2">Benefits Guide</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Complete overview of all available benefits
            </p>
            <Button variant="secondary" size="sm" className="mt-3">
              Download PDF
            </Button>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-2xl">🧮</span>
            <h4 className="font-medium text-gray-900 dark:text-white mt-2">Cost Calculator</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Estimate your benefits costs and coverage
            </p>
            <Button variant="secondary" size="sm" className="mt-3">
              Calculate
            </Button>
          </div>
          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-2xl">❓</span>
            <h4 className="font-medium text-gray-900 dark:text-white mt-2">FAQs</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Common questions about benefits enrollment
            </p>
            <Button variant="secondary" size="sm" className="mt-3">
              View FAQs
            </Button>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card variant="bordered">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Need Help?</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Contact HR for benefits questions or to schedule a benefits consultation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Email HR</Button>
            <Button>Schedule Call</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Benefits;
