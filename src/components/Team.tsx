import React, { useState } from 'react';
import { User } from '../types';
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_RECOGNITIONS,
  MOCK_VALUES,
  MOCK_USERS,
} from '../constants';
import { useAuditLogs } from '../context/AuditLogContext';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';

import Breadcrumbs from './ui/Breadcrumbs';
import { View } from '../types';

interface TeamProps {
  user: User;
  setActiveView: (view: View) => void;
}

const Team: React.FC<TeamProps> = ({ user, setActiveView }) => {
  const { logAction } = useAuditLogs();
  const { config } = useIndustry();
  const [recognitions, setRecognitions] = useState(MOCK_RECOGNITIONS);
  const [selectedValue, setSelectedValue] = useState(MOCK_VALUES[0].id);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitRecognition = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRecipient || !message) {
      alert('Please select a recipient and enter a message.');
      return;
    }

    const recipient = MOCK_USERS.find(u => u.id === selectedRecipient);
    const value = MOCK_VALUES.find(v => v.id === selectedValue);

    if (!recipient || !value) return;

    const newRecognition = {
      id: `r-${Date.now()}`,
      from: user.name,
      fromId: user.id,
      to: recipient.name,
      toId: recipient.id,
      message,
      date: new Date().toISOString().split('T')[0],
      valueId: selectedValue,
      reactions: [],
    };

    setRecognitions(prev => [newRecognition, ...prev]);
    logAction(user, 'GIVE_RECOGNITION', 'hr', `Recognized ${recipient.name} for ${value.name}`);
    setMessage('');
    setSelectedRecipient('');
  };

  const getValueColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      purple: {
        bg: 'bg-status-info/10',
        text: 'text-status-info',
        border: 'border-status-info/20',
      },
      blue: {
        bg: 'bg-action-secondary/10',
        text: 'text-action-secondary',
        border: 'border-action-secondary/20',
      },
      gold: {
        bg: 'bg-status-warning/10',
        text: 'text-status-warning',
        border: 'border-status-warning/20',
      },
      green: {
        bg: 'bg-status-success/10',
        text: 'text-status-success',
        border: 'border-status-success/20',
      },
      red: {
        bg: 'bg-status-error/10',
        text: 'text-status-error',
        border: 'border-status-error/20',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Team' }, { label: 'Team Hub' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text">Team Hub</h1>
        <p className="text-text-tertiary dark:text-dark-text-secondary mt-1">
          Connect with your {config.terminology.employees.toLowerCase()}, share recognition, and
          stay updated.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recognition Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recognition Feed */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">
                Recognition Feed
              </h3>
              <span className="px-3 py-1 bg-action-primary/10 text-action-primary text-sm font-medium rounded-full border border-action-primary/20">
                {recognitions.length} kudos
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {recognitions.map(rec => {
                const value = MOCK_VALUES.find(v => v.id === rec.valueId);
                const colors = value ? getValueColor(value.color) : getValueColor('blue');

                return (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-2xl border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colors.bg}`}
                        >
                          {value?.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {rec.from}
                          </span>
                          <span className="text-gray-500 dark:text-slate-400">recognized</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {rec.to}
                          </span>
                          <span className="text-gray-500 dark:text-slate-400">for</span>
                          <span className={`font-semibold ${colors.text}`}>{value?.name}</span>
                        </div>
                        <p className="text-gray-700 dark:text-slate-300 mt-2">
                          &quot;{rec.message}&quot;
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            {rec.date}
                          </span>
                          {rec.reactions && rec.reactions.length > 0 && (
                            <div className="flex items-center gap-2">
                              {rec.reactions.map((reaction, idx) => (
                                <span
                                  key={idx}
                                  className="flex items-center gap-1 px-2 py-1 bg-white/50 dark:bg-slate-700/50 rounded-full text-sm"
                                >
                                  {reaction.emoji}{' '}
                                  <span className="text-gray-600 dark:text-slate-400">
                                    {reaction.count}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Announcements */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Announcements</h3>
            </div>
            <div className="space-y-4">
              {MOCK_ANNOUNCEMENTS.map(announcement => (
                <div
                  key={announcement.id}
                  className="p-4 rounded-xl bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border border-l-4 border-l-action-primary"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-text-primary dark:text-dark-text">
                          {announcement.title}
                        </h4>
                        {announcement.pinned && (
                          <svg
                            className="w-4 h-4 text-action-primary"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-2 0v1h2zm6 0h-2V5a1 1 0 112 0v1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {announcement.priority === 'important' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-status-warning/10 text-status-warning border border-status-warning/20 rounded-full">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-slate-300 mt-2">
                        {announcement.content}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-3">
                        {announcement.author} • {announcement.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Give Recognition & Values */}
        <div className="space-y-6">
          {/* Give Recognition */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Give Recognition
            </h3>
            <form onSubmit={handleSubmitRecognition} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Recognize
                </label>
                <select
                  value={selectedRecipient}
                  onChange={e => setSelectedRecipient(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none text-text-primary dark:text-dark-text"
                >
                  <option value="">Select a team member</option>
                  {MOCK_USERS.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  For
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_VALUES.map(value => {
                    const colors = getValueColor(value.color);
                    return (
                      <button
                        key={value.id}
                        type="button"
                        onClick={() => setSelectedValue(value.id)}
                        className={`p-3 rounded-xl border-2 transition-all ${selectedValue === value.id
                            ? `${colors.border} ${colors.bg} ring-2 ring-offset-2`
                            : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                          }`}
                        style={
                          {
                            '--tw-ring-color':
                              selectedValue === value.id
                                ? colors.text.replace('text-', '').split(' ')[0]
                                : undefined,
                          } as React.CSSProperties
                        }
                      >
                        <span className="text-2xl">{value.icon}</span>
                        <p
                          className={`text-sm font-medium mt-1 ${selectedValue === value.id ? colors.text : 'text-gray-700 dark:text-slate-300'}`}
                        >
                          {value.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Share why this person deserves recognition..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Send Recognition
              </Button>
            </form>
          </Card>

          {/* Company Values */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our Values</h3>
            <div className="space-y-3">
              {MOCK_VALUES.map(value => {
                const colors = getValueColor(value.color);
                return (
                  <div
                    key={value.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50"
                  >
                    <span className="text-2xl">{value.icon}</span>
                    <div>
                      <h4 className={`font-medium ${colors.text}`}>{value.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Team;
