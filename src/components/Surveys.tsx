import React, { useState } from 'react';
import { User, Survey, SurveyType, SurveyStatus, View } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import ProgressBar from './ui/ProgressBar';
import { SurveysIcon, CheckCircleIcon } from './ui/icons/Icon';
import { MOCK_SURVEYS } from '../constants';

interface SurveysProps {
  user: User;
  setActiveView?: (view: View) => void;
}

const Surveys: React.FC<SurveysProps> = ({ user: _user, setActiveView: _setActiveView }) => {
  const { config: _config } = useIndustry();
  const [surveys] = useState<Survey[]>(MOCK_SURVEYS);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  const pendingSurveys = surveys.filter(s => s.status === 'active');
  const completedSurveys = surveys.filter(s => s.status === 'completed');

  const getTypeIcon = (type: SurveyType) => {
    switch (type) {
      case 'pulse':
        return '📊';
      case 'engagement':
        return '💬';
      case 'onboarding':
        return '👋';
      case 'exit':
        return '👋';
      case 'custom':
        return '📝';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: SurveyStatus) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
      case 'closed':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
    }
  };

  const openSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setShowSurveyModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl text-white">
              <SurveysIcon className="w-6 h-6" />
            </div>
            Surveys & Feedback
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Share your voice and help us improve
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingSurveys.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Pending Surveys</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedSurveys.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Completed</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">Participation Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Required */}
      {pendingSurveys.length > 0 && (
        <Card variant="elevated" className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Action Required
              </h3>
              <p className="text-gray-500 dark:text-slate-400 mt-1">
                You have {pendingSurveys.length} survey{pendingSurveys.length > 1 ? 's' : ''}{' '}
                waiting for your feedback
              </p>
            </div>
            <Button onClick={() => pendingSurveys[0] && openSurvey(pendingSurveys[0])}>
              Start Survey
            </Button>
          </div>
        </Card>
      )}

      {/* Pending Surveys */}
      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Surveys</h3>
        <div className="space-y-4">
          {pendingSurveys.length > 0 ? (
            pendingSurveys.map(survey => (
              <div
                key={survey.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => openSurvey(survey)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{getTypeIcon(survey.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{survey.title}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {survey.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
                      <span>{survey.questions.length} questions</span>
                      <span>~{survey.estimatedTime} min</span>
                      <span>Due: {new Date(survey.dueDate!).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button>Take Survey</Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">✨</span>
              <p className="text-gray-500 dark:text-slate-400">
                You&apos;re all caught up! No pending surveys.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Completed Surveys */}
      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Completed Surveys
        </h3>
        <div className="space-y-4">
          {completedSurveys.map(survey => (
            <div
              key={survey.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getTypeIcon(survey.type)}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {survey.title}
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Completed on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor('completed')}`}>
                Completed
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Company Results */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Survey Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-slate-300">
                Employee Engagement Score
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">82%</span>
            </div>
            <ProgressBar value={82} variant="gradient" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-slate-300">
                Manager Satisfaction
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">88%</span>
            </div>
            <ProgressBar value={88} variant="success" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-slate-300">Work-Life Balance</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">75%</span>
            </div>
            <ProgressBar value={75} variant="warning" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-slate-300">Career Development</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">79%</span>
            </div>
            <ProgressBar value={79} variant="gradient" />
          </div>
        </div>
      </Card>

      {/* Anonymous Feedback */}
      <Card variant="bordered">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <span className="text-2xl">🔒</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">Anonymous Feedback</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Your responses are completely anonymous. We only report aggregated results to protect
              your privacy.
            </p>
          </div>
          <Button variant="secondary">Learn More</Button>
        </div>
      </Card>

      {/* Survey Modal */}
      <Modal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        title={selectedSurvey?.title || 'Survey'}
        size="lg"
      >
        {selectedSurvey && (
          <div className="space-y-6">
            {/* Survey Info */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getTypeIcon(selectedSurvey.type)}</span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {selectedSurvey.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
                    <span>{selectedSurvey.questions.length} questions</span>
                    <span>~{selectedSurvey.estimatedTime} min</span>
                    {selectedSurvey.isAnonymous && (
                      <span className="flex items-center gap-1">
                        <span>🔒</span> Anonymous
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="space-y-4">
              {selectedSurvey.questions.slice(0, 3).map((question, i) => (
                <div key={question.id} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <p className="font-medium text-gray-900 dark:text-white mb-3">
                    {i + 1}. {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {question.type === 'rating' && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                  {question.type === 'text' && (
                    <textarea
                      placeholder="Enter your response..."
                      className="w-full p-3 bg-white dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={3}
                    />
                  )}
                  {question.type === 'multiple_choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, j) => (
                        <label
                          key={j}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-gray-700 dark:text-slate-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {selectedSurvey.questions.length > 3 && (
                <p className="text-center text-sm text-gray-500 dark:text-slate-400">
                  + {selectedSurvey.questions.length - 3} more questions
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowSurveyModal(false)}
              >
                Save & Continue Later
              </Button>
              <Button className="flex-1">Submit Survey</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Surveys;
