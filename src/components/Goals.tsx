import React, { useState } from 'react';
import { User, Goal, UserRole, Priority } from '../types';
import { MOCK_USERS, createAuditLog } from '../constants';
import ProgressBar from './ui/ProgressBar';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { GoalService } from '../services/goalService';
import Breadcrumbs from './ui/Breadcrumbs';
import EmptyState from './ui/EmptyState';
import { View } from '../types';

interface GoalsProps {
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

const GoalCard: React.FC<{
  goal: Goal;
  onUpdate: (goal: Goal) => void;
  showOwner?: boolean;
}> = ({ goal, onUpdate, showOwner = false }) => {
  const owner = MOCK_USERS.find(u => u.id === goal.owner);

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'default';
    if (progress >= 25) return 'warning';
    return 'danger';
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {goal.isTeamGoal && (
              <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
                Team Goal
              </span>
            )}
            {goal.category && (
              <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full">
                {goal.category}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
            {goal.description}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {goal.progress}%
          </span>
        </div>
      </div>

      <ProgressBar
        progress={goal.progress}
        variant={getProgressColor(goal.progress)}
        className="mb-4"
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {showOwner && owner && (
            <div className="flex items-center gap-2">
              <img src={owner.avatarUrl} alt={owner.name} className="w-6 h-6 rounded-full" />
              <span className="text-gray-600 dark:text-slate-400">{owner.name}</span>
            </div>
          )}
          <PriorityBadge priority={goal.priority} />
        </div>
        <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400">
          {goal.dueDate && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(goal.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {goal.estimatedTime}h
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
        <button
          onClick={() => onUpdate(goal)}
          className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          Update Progress
        </button>
      </div>
    </div>
  );
};

const Goals: React.FC<GoalsProps> = ({ user, setActiveView }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'team'>('my');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newProgress, setNewProgress] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    priority: 'Medium' as Priority,
    estimatedTime: 10,
    dueDate: '',
    isTeamGoal: false,
    category: '',
  });

  // Load goals
  React.useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        // Use GoalService which handles both Supabase and Mock modes
        const allGoals = await GoalService.getGoalsByUserId(user.id);

        // If user is manager/admin, they might want to see more, but for now
        // we filter the UI tabs based on this list.
        setGoals(allGoals);
      } catch (err) {
        console.error('Failed to load goals', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoals();
  }, [user.id]);

  const myGoals = goals.filter(g => g.owner === user.id && !g.isTeamGoal);
  const teamGoals = goals.filter(g => g.isTeamGoal);

  const handleOpenUpdateModal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewProgress(goal.progress);
  };

  const handleUpdateProgress = async () => {
    if (!editingGoal) return;
    const updated = { ...editingGoal, progress: newProgress };

    // Optimistic update
    setGoals(prev => prev.map(g => (g.id === editingGoal.id ? updated : g)));

    try {
      await GoalService.updateGoal(updated);
      createAuditLog(user, 'UPDATE_GOAL', `Updated goal "${editingGoal.title}" to ${newProgress}%`);
    } catch (err) {
      console.error('Update failed', err);
    }

    setEditingGoal(null);
  };

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.description) {
      alert('Please fill in title and description.');
      return;
    }
    const goalToAdd: Goal = {
      id: `g-${Date.now()}`,
      progress: 0,
      owner: user.id,
      status: 'not-started',
      ...newGoal,
    };

    // Optimistic update
    setGoals(prev => [...prev, goalToAdd]);

    try {
      await GoalService.createGoal(goalToAdd);
      createAuditLog(user, 'ADD_GOAL', `Created goal: "${goalToAdd.title}"`);
    } catch (err) {
      console.error('Create failed', err);
    }

    setIsAddModalOpen(false);
    setNewGoal({
      title: '',
      description: '',
      priority: 'Medium',
      estimatedTime: 10,
      dueDate: '',
      isTeamGoal: false,
      category: '',
    });
  };

  const averageProgress = (goalsList: Goal[]) => {
    if (goalsList.length === 0) return 0;
    return Math.round(goalsList.reduce((sum, g) => sum + g.progress, 0) / goalsList.length);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Work' }, { label: 'Goals' }]} setActiveView={setActiveView} />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Track progress on your personal and team objectives.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <p className="text-indigo-100 text-sm font-medium">My Goals</p>
          <p className="text-3xl font-bold mt-2">{myGoals.length}</p>
          <p className="text-indigo-100 text-sm mt-1">{averageProgress(myGoals)}% avg progress</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white">
          <p className="text-violet-100 text-sm font-medium">Team Goals</p>
          <p className="text-3xl font-bold mt-2">{teamGoals.length}</p>
          <p className="text-violet-100 text-sm mt-1">{averageProgress(teamGoals)}% avg progress</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <p className="text-emerald-100 text-sm font-medium">On Track</p>
          <p className="text-3xl font-bold mt-2">{goals.filter(g => g.progress >= 50).length}</p>
          <p className="text-emerald-100 text-sm mt-1">of {goals.length} total goals</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('my')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            My Goals ({myGoals.length})
          </button>
          {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
            <button
              onClick={() => setActiveTab('team')}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'team'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Team Goals ({teamGoals.length})
            </button>
          )}
        </nav>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(activeTab === 'my' ? myGoals : teamGoals).map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdate={handleOpenUpdateModal}
            showOwner={activeTab === 'team'}
          />
        ))}
        {(activeTab === 'my' ? myGoals : teamGoals).length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title={activeTab === 'my' ? 'No personal goals yet' : 'No team goals found'}
              description={
                activeTab === 'my'
                  ? 'Start tracking your personal development and work objectives.'
                  : 'Collaborate with your team by setting shared goals.'
              }
              actionLabel="Create First Goal"
              onAction={() => setIsAddModalOpen(true)}
              icon="🎯"
            />
          </div>
        )}
      </div>

      {/* Update Progress Modal */}
      <Modal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        title={`Update: ${editingGoal?.title}`}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Progress
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newProgress}
              onChange={e => setNewProgress(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400 mt-2">
              <span>0%</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {newProgress}%
              </span>
              <span>100%</span>
            </div>
          </div>
          <ProgressBar progress={newProgress} variant="gradient" className="h-4" />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditingGoal(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateProgress}>
              Save Progress
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Goal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newGoal.title}
              onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter goal title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={newGoal.description}
              onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your goal..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={newGoal.priority}
                onChange={e => setNewGoal({ ...newGoal, priority: e.target.value as Priority })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newGoal.category}
                onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                <option value="Professional">Professional</option>
                <option value="Technical">Technical</option>
                <option value="Leadership">Leadership</option>
                <option value="Personal">Personal</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Estimated Time (h)
              </label>
              <input
                type="number"
                value={newGoal.estimatedTime}
                onChange={e =>
                  setNewGoal({ ...newGoal, estimatedTime: parseInt(e.target.value) || 0 })
                }
                min="0"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={newGoal.dueDate}
                onChange={e => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isTeamGoal"
              checked={newGoal.isTeamGoal}
              onChange={e => setNewGoal({ ...newGoal, isTeamGoal: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isTeamGoal" className="text-sm text-gray-700 dark:text-slate-300">
              This is a team goal
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddGoal}>
              Create Goal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Goals;
