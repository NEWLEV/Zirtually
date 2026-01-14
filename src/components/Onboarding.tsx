import React, { useState, useMemo } from 'react';
import { User, OnboardingTask, TaskStatus, Policy, UserRole, Priority } from '../types';
import { MOCK_ONBOARDING_TASKS, MOCK_POLICIES, MOCK_USERS } from '../constants';
import { useAuditLogs } from '../context/AuditLogContext';
import { useIndustry } from '../App';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Breadcrumbs from './ui/Breadcrumbs';
import { View } from '../types';

interface OnboardingProps {
  user: User;
  setActiveView: (view: View) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const classes = {
    High: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300',
    Medium: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    Low: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${classes[priority]}`}>
      {priority}
    </span>
  );
};

const getDueDateStatus = (dueDate: string, status: TaskStatus) => {
  if (status === TaskStatus.DONE) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { text: 'Overdue', class: 'text-rose-600 dark:text-rose-400' };
  if (diff <= 3) return { text: `${diff}d left`, class: 'text-amber-600 dark:text-amber-400' };
  return {
    text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    class: 'text-gray-500 dark:text-slate-400',
  };
};

const Onboarding: React.FC<OnboardingProps> = ({ user, setActiveView }) => {
  const { logAction } = useAuditLogs();
  const { config } = useIndustry();
  const [tasks, setTasks] = useState<OnboardingTask[]>(MOCK_ONBOARDING_TASKS);
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [canAcknowledge, setCanAcknowledge] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'dueDate' | 'priority'>('default');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const visibleTasks =
    user.role === UserRole.MANAGER || user.role === UserRole.ADMIN
      ? tasks
      : tasks.filter(task => task.assignedTo === user.id);

  const categories = useMemo(() => {
    const cats = new Set(visibleTasks.map(t => t.category));
    return ['all', ...Array.from(cats)];
  }, [visibleTasks]);

  const filteredTasks = useMemo(() => {
    let result =
      filterCategory === 'all'
        ? visibleTasks
        : visibleTasks.filter(t => t.category === filterCategory);

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };

    if (sortBy === 'dueDate') {
      result = [...result].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    } else if (sortBy === 'priority') {
      result = [...result].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return result;
  }, [visibleTasks, filterCategory, sortBy]);

  const completedTasks = visibleTasks.filter(t => t.status === TaskStatus.DONE).length;
  const totalTasks = visibleTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const unacknowledgedPolicies = policies.filter(p => p.required && !p.acknowledged).length;

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
          logAction(
            user,
            newStatus === TaskStatus.DONE ? 'COMPLETE_TASK' : 'UNCOMPLETE_TASK',
            'hr',
            `Task: "${task.title}"`
          );
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const openPolicyModal = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsPolicyModalOpen(true);
    setCanAcknowledge(false);
  };

  const handleAcknowledge = () => {
    if (selectedPolicy) {
      setPolicies(
        policies.map(p => (p.id === selectedPolicy.id ? { ...p, acknowledged: true } : p))
      );
      logAction(user, 'ACKNOWLEDGE_POLICY', 'compliance', `Acknowledged: "${selectedPolicy.title}"`);
    }
    setIsPolicyModalOpen(false);
    setSelectedPolicy(null);
  };

  const getProgressColor = () => {
    if (progress >= 75) return 'from-status-success to-action-primary';
    if (progress >= 50) return 'from-action-secondary to-focus-ring';
    if (progress >= 25) return 'from-status-warning to-status-warning/80';
    return 'from-status-error to-status-error/80';
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Work' }, { label: 'Onboarding' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Onboarding</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            {user.isNewHire
              ? `Welcome! Let's get you set up and ready to go.`
              : `Manage onboarding tasks for your ${config.terminology.employees.toLowerCase()}.`}
          </p>
        </div>
      </div>

      {/* Alert for unacknowledged policies */}
      {user.isNewHire && unacknowledgedPolicies > 0 && (
        <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-amber-800 dark:text-amber-200">Action Required</h4>
            <p className="text-sm text-amber-600 dark:text-amber-300">
              You have {unacknowledgedPolicies} required{' '}
              {unacknowledgedPolicies === 1 ? 'policy' : 'policies'} to review.
            </p>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.isNewHire ? 'Your Onboarding Progress' : 'Team Onboarding Progress'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              {completedTasks} of {totalTasks} tasks completed
            </p>
            <div className="mt-4">
              <ProgressBar progress={progress} variant="gradient" className="h-3" />
            </div>
          </div>
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getProgressColor()} shadow-lg`}
            >
              <span className="text-xl font-bold text-text-inverse">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
              <div className="flex items-center gap-3">
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="text-sm bg-bg-secondary dark:bg-dark-card border border-border-medium dark:border-dark-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-focus-ring outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'default' | 'dueDate' | 'priority')}
                  className="text-sm bg-bg-secondary dark:bg-dark-card border border-border-medium dark:border-dark-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-focus-ring outline-none"
                >
                  <option value="default">Default Order</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTasks.map(task => {
                const dueStatus = getDueDateStatus(task.dueDate, task.status);
                const assignee = MOCK_USERS.find(u => u.id === task.assignedTo);

                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${task.status === TaskStatus.DONE
                        ? 'bg-bg-secondary dark:bg-dark-card/50 border-border-light dark:border-dark-border opacity-60'
                        : 'bg-bg-elevated dark:bg-dark-card border-border-medium dark:border-dark-border hover:border-action-secondary dark:hover:border-action-secondary'
                      }`}
                  >
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.status === TaskStatus.DONE
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 dark:border-slate-600 hover:border-emerald-500'
                        }`}
                    >
                      {task.status === TaskStatus.DONE && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-medium ${task.status === TaskStatus.DONE ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}
                        >
                          {task.title}
                        </h4>
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full">
                          {task.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        {dueStatus && <span className={dueStatus.class}>{dueStatus.text}</span>}
                        <span className="text-gray-400 dark:text-slate-500">
                          ~{task.estimatedTime}h
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <PriorityBadge priority={task.priority} />
                      {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && assignee && (
                        <img
                          src={assignee.avatarUrl}
                          alt={assignee.name}
                          title={`Assigned to ${assignee.name}`}
                          className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-800"
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p>No tasks found.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Policies Section */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Policy Acknowledgment
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              Please review and acknowledge the following policies.
            </p>

            <div className="space-y-3">
              {policies.map(policy => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${policy.acknowledged
                          ? 'bg-emerald-100 dark:bg-emerald-900/50'
                          : 'bg-gray-200 dark:bg-slate-600'
                        }`}
                    >
                      {policy.acknowledged ? (
                        <svg
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-gray-400 dark:text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {policy.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {policy.required ? 'Required' : 'Optional'} • {policy.version}
                      </p>
                    </div>
                  </div>
                  {policy.acknowledged ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Done
                    </span>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => openPolicyModal(policy)}>
                      Review
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Policy Modal */}
      <Modal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        title={selectedPolicy?.title || ''}
      >
        <div className="space-y-6">
          <div className="max-h-60 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl text-sm text-gray-600 dark:text-slate-300">
            <p>
              This document outlines the procedures and expectations regarding this policy. All{' '}
              {config.terminology.employees.toLowerCase()} are required to read and understand this
              policy thoroughly.
            </p>
            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse
              lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
            </p>
            <p className="mt-4">
              Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod
              non, mi.
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 bg-action-primary/5 dark:bg-action-primary/10 rounded-xl cursor-pointer border border-action-primary/10">
            <input
              type="checkbox"
              checked={canAcknowledge}
              onChange={e => setCanAcknowledge(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-border-medium text-action-primary focus:ring-focus-ring"
            />
            <span className="text-sm text-gray-700 dark:text-slate-300">
              I confirm that I have read, understood, and agree to abide by this policy.
            </span>
          </label>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsPolicyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAcknowledge} disabled={!canAcknowledge}>
              Acknowledge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Onboarding;
