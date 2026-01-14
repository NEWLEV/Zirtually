import React, { useState } from 'react';
import { User, View } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import ProgressBar from './ui/ProgressBar';
import { CheckCircleIcon } from './ui/icons/Icon';

interface OffboardingProps {
  user: User;
  setActiveView?: (view: View) => void;
}

interface OffboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'hr' | 'it' | 'manager' | 'employee' | 'finance';
  assignedTo: 'employee' | 'manager' | 'hr' | 'it' | 'finance';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: string;
  completedDate?: string;
  notes?: string;
  required: boolean;
}

interface ExitInterview {
  scheduled: boolean;
  date?: string;
  interviewer?: string;
  completed: boolean;
}

const MOCK_OFFBOARDING_TASKS: OffboardingTask[] = [
  {
    id: 'task-1',
    title: 'Submit Resignation Letter',
    description: 'Formal resignation letter submitted to HR and direct manager',
    category: 'hr',
    assignedTo: 'employee',
    status: 'completed',
    dueDate: '2025-01-15',
    completedDate: '2025-01-10',
    required: true,
  },
  {
    id: 'task-2',
    title: 'Knowledge Transfer Documentation',
    description: 'Document all ongoing projects, processes, and key information for successors',
    category: 'manager',
    assignedTo: 'employee',
    status: 'in_progress',
    dueDate: '2025-01-25',
    required: true,
  },
  {
    id: 'task-3',
    title: 'Complete Exit Interview',
    description: 'Participate in exit interview with HR',
    category: 'hr',
    assignedTo: 'employee',
    status: 'pending',
    dueDate: '2025-01-28',
    required: true,
  },
  {
    id: 'task-4',
    title: 'Return Company Equipment',
    description: 'Return laptop, badge, keys, and any other company property',
    category: 'it',
    assignedTo: 'employee',
    status: 'pending',
    dueDate: '2025-01-31',
    required: true,
  },
  {
    id: 'task-5',
    title: 'Final Expense Report',
    description: 'Submit any outstanding expense reports',
    category: 'finance',
    assignedTo: 'employee',
    status: 'completed',
    dueDate: '2025-01-20',
    completedDate: '2025-01-18',
    required: false,
  },
  {
    id: 'task-6',
    title: 'Benefits Information Review',
    description: 'Review COBRA options and 401(k) rollover information',
    category: 'hr',
    assignedTo: 'employee',
    status: 'pending',
    dueDate: '2025-01-25',
    required: true,
  },
  {
    id: 'task-7',
    title: 'Update Emergency Contacts',
    description: 'Provide personal contact information for post-employment communications',
    category: 'hr',
    assignedTo: 'employee',
    status: 'pending',
    dueDate: '2025-01-28',
    required: false,
  },
  {
    id: 'task-8',
    title: 'Revoke System Access',
    description: 'IT to revoke all system access and credentials',
    category: 'it',
    assignedTo: 'it',
    status: 'pending',
    dueDate: '2025-01-31',
    required: true,
  },
  {
    id: 'task-9',
    title: 'Final Paycheck Setup',
    description: 'Confirm final pay, PTO payout, and payment method',
    category: 'finance',
    assignedTo: 'hr',
    status: 'in_progress',
    dueDate: '2025-01-31',
    required: true,
  },
  {
    id: 'task-10',
    title: 'Team Farewell',
    description: 'Organize farewell event or send goodbye message',
    category: 'manager',
    assignedTo: 'employee',
    status: 'pending',
    dueDate: '2025-01-30',
    required: false,
  },
];

const Offboarding: React.FC<OffboardingProps> = () => {
  const [tasks, setTasks] = useState<OffboardingTask[]>(MOCK_OFFBOARDING_TASKS);
  const [selectedTask, setSelectedTask] = useState<OffboardingTask | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [exitInterview] = useState<ExitInterview>({
    scheduled: true,
    date: '2025-01-28T14:00:00',
    interviewer: 'Sarah Chen (HR Manager)',
    completed: false,
  });

  const lastDay = new Date('2025-01-31');
  const today = new Date();
  const daysRemaining = Math.ceil((lastDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  const myTasks = tasks.filter(t => t.assignedTo === 'employee');
  const otherTasks = tasks.filter(t => t.assignedTo !== 'employee');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400';
      case 'it':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'manager':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      case 'finance':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hr':
        return '👥';
      case 'it':
        return '💻';
      case 'manager':
        return '👔';
      case 'finance':
        return '💰';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
    }
  };

  const markTaskComplete = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed', completedDate: new Date().toISOString().split('T')[0] }
          : t
      )
    );
    setShowTaskModal(false);
  };

  const viewTask = (task: OffboardingTask) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const TaskCard: React.FC<{ task: OffboardingTask }> = ({ task }) => (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
        task.status === 'completed'
          ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
          : task.status === 'in_progress'
            ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800'
            : 'bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700'
      }`}
      onClick={() => viewTask(task)}
    >
      {/* Status Indicator */}
      <div className="flex-shrink-0">
        {task.status === 'completed' ? (
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
        ) : task.status === 'in_progress' ? (
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-slate-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`font-medium ${
              task.status === 'completed'
                ? 'text-gray-500 dark:text-slate-400 line-through'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.title}
          </p>
          {task.required && <span className="text-xs text-red-500 font-medium">Required</span>}
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{task.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(task.category)}`}>
            {task.category.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      {task.status !== 'completed' && task.assignedTo === 'employee' && (
        <Button
          size="sm"
          onClick={e => {
            e.stopPropagation();
            markTaskComplete(task.id);
          }}
        >
          Complete
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white">
              <span className="text-xl">👋</span>
            </div>
            Offboarding
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Complete your offboarding tasks before your last day
          </p>
        </div>
        <Button variant="secondary">Contact HR</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          variant="elevated"
          className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0"
        >
          <div className="text-center">
            <p className="text-5xl font-bold">{daysRemaining}</p>
            <p className="text-white/80 mt-1">Days Remaining</p>
            <p className="text-sm text-white/60 mt-2">Last Day: {lastDay.toLocaleDateString()}</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{progress}%</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Progress</p>
            <ProgressBar value={progress} variant="gradient" className="mt-3" />
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {completedTasks}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Completed</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {totalTasks - completedTasks}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Remaining</p>
          </div>
        </Card>
      </div>

      {/* Exit Interview Banner */}
      <Card variant="bordered" className="border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <span className="text-2xl">🎤</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Exit Interview Scheduled
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {exitInterview.date &&
                  new Date(exitInterview.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                With: {exitInterview.interviewer}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Reschedule
            </Button>
            <Button size="sm">Add to Calendar</Button>
          </div>
        </div>
      </Card>

      {/* My Tasks */}
      <Card variant="bordered">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Tasks ({myTasks.filter(t => t.status === 'completed').length}/{myTasks.length})
          </h3>
          <span className="text-sm text-gray-500 dark:text-slate-400">
            {myTasks.filter(t => t.status !== 'completed' && t.required).length} required tasks
            remaining
          </span>
        </div>
        <div className="space-y-3">
          {myTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </Card>

      {/* Other Tasks */}
      <Card variant="bordered">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Other Department Tasks
          </h3>
          <span className="text-sm text-gray-500 dark:text-slate-400">
            Tasks being handled by HR, IT, and Finance
          </span>
        </div>
        <div className="space-y-3">
          {otherTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                task.status === 'completed'
                  ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {task.status === 'completed' ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-slate-600 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    task.status === 'completed'
                      ? 'text-gray-500 dark:text-slate-400 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(task.category)}`}
                  >
                    {getCategoryIcon(task.category)} {task.assignedTo.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Important Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Final Pay Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
              <span className="text-gray-600 dark:text-slate-300">Final Paycheck Date</span>
              <span className="font-medium text-gray-900 dark:text-white">January 31, 2025</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
              <span className="text-gray-600 dark:text-slate-300">PTO Payout</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                5 days ($1,250)
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-slate-300">Payment Method</span>
              <span className="font-medium text-gray-900 dark:text-white">Direct Deposit</span>
            </div>
          </div>
        </Card>

        <Card variant="glass">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Benefits Continuation
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-xl">🏥</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">COBRA Coverage</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  You&apos;ll receive COBRA election materials within 14 days
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-xl">💰</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">401(k) Rollover</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Contact Fidelity for rollover options
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Equipment Return */}
      <Card variant="bordered" className="border-l-4 border-l-blue-500">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Equipment to Return
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Laptop', icon: '💻', returned: false },
            { name: 'Badge', icon: '🪪', returned: false },
            { name: 'Keys', icon: '🔑', returned: false },
            { name: 'Company Phone', icon: '📱', returned: true },
          ].map(item => (
            <div
              key={item.name}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                item.returned ? 'bg-green-50 dark:bg-green-900/10' : 'bg-gray-50 dark:bg-slate-800'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                <p
                  className={`text-xs ${
                    item.returned
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-slate-400'
                  }`}
                >
                  {item.returned ? 'Returned ✓' : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" className="text-center">
          <span className="text-3xl mb-2 block">👥</span>
          <h4 className="font-semibold text-gray-900 dark:text-white">HR Contact</h4>
          <p className="text-sm text-gray-500 dark:text-slate-400">Sarah Chen</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400">hr@company.com</p>
        </Card>
        <Card variant="glass" className="text-center">
          <span className="text-3xl mb-2 block">💻</span>
          <h4 className="font-semibold text-gray-900 dark:text-white">IT Support</h4>
          <p className="text-sm text-gray-500 dark:text-slate-400">Help Desk</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400">it@company.com</p>
        </Card>
        <Card variant="glass" className="text-center">
          <span className="text-3xl mb-2 block">👔</span>
          <h4 className="font-semibold text-gray-900 dark:text-white">Your Manager</h4>
          <p className="text-sm text-gray-500 dark:text-slate-400">Michael Rodriguez</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400">m.rodriguez@company.com</p>
        </Card>
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Task Details"
        size="md"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{getCategoryIcon(selectedTask.category)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {selectedTask.title}
                  </h4>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedTask.status)}`}
                  >
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Description</p>
              <p className="text-gray-900 dark:text-white">{selectedTask.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Due Date</p>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Assigned To</p>
                <p className="text-gray-900 dark:text-white capitalize">
                  {selectedTask.assignedTo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Category</p>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(selectedTask.category)}`}
                >
                  {selectedTask.category.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Required</p>
                <p className="text-gray-900 dark:text-white">
                  {selectedTask.required ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {selectedTask.completedDate && (
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Completed On</p>
                <p className="text-green-600 dark:text-green-400">
                  {new Date(selectedTask.completedDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowTaskModal(false)}
              >
                Close
              </Button>
              {selectedTask.status !== 'completed' && selectedTask.assignedTo === 'employee' && (
                <Button className="flex-1" onClick={() => markTaskComplete(selectedTask.id)}>
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Offboarding;
