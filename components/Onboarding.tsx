import React, { useState, useEffect, useMemo } from 'react';
import { User, OnboardingTask, TaskStatus, Policy, UserRole, Priority } from '../types';
import { MOCK_ONBOARDING_TASKS, MOCK_POLICIES, MOCK_USERS, createAuditLog } from '../constants';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { CheckCircleIcon } from './ui/icons/Icon';

interface OnboardingProps {
  user: User;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
    const priorityClasses = {
        High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[priority]}`}>
            {priority}
        </span>
    );
};

const getDueDateInfo = (dueDateStr: string, status: TaskStatus): { text: string; className: string } | null => {
    if (status === TaskStatus.DONE || !dueDateStr) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `Overdue`, className: 'text-red-600 dark:text-red-400 font-semibold' };
    }
    if (diffDays <= 3) {
        return { text: `Due in ${diffDays}d`, className: 'text-yellow-600 dark:text-yellow-400 font-semibold' };
    }
    return { text: `Due ${dueDateStr}`, className: 'text-gray-500 dark:text-dark-text-secondary' };
};

const Onboarding: React.FC<OnboardingProps> = ({ user }) => {
  const [tasks, setTasks] = useState<OnboardingTask[]>(() => {
    try {
      const savedTasks = localStorage.getItem('onboardingTasks');
      return savedTasks ? JSON.parse(savedTasks) : MOCK_ONBOARDING_TASKS;
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      return MOCK_ONBOARDING_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('onboardingTasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);
  
  const [policies, setPolicies] = useState<Policy[]>(MOCK_POLICIES);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [canAcknowledge, setCanAcknowledge] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Department' as 'IT' | 'HR' | 'Department',
    dueDate: '',
    assignedTo: MOCK_USERS.find(u => u.role === UserRole.STAFF)?.id || '',
    priority: 'Medium' as Priority,
    estimatedTime: 1,
  });
  
  const visibleTasks = user.role === UserRole.MANAGER || user.role === UserRole.ADMIN
    ? tasks 
    : tasks.filter(task => task.assignedTo === user.id);

  const completedTasks = visibleTasks.filter(t => t.status === TaskStatus.DONE).length;
  const totalTasks = visibleTasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const unacknowledgedPolicies = policies.filter(p => !p.acknowledged).length;

  const sortedTasks = useMemo(() => {
    const tasksToSort = [...visibleTasks];
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };

    if (sortBy === 'dueDate') {
        return tasksToSort.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    if (sortBy === 'priority') {
        return tasksToSort.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    if (sortBy === 'estimatedTime') {
        return tasksToSort.sort((a, b) => b.estimatedTime - a.estimatedTime);
    }
    return tasksToSort; // default order
  }, [visibleTasks, sortBy]);

  const handleToggleTask = (taskId: string) => {
    let toggledTask: OnboardingTask | undefined;
    setTasks(tasks.map(task => {
        if (task.id === taskId) {
            const newStatus = task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
            toggledTask = { ...task, status: newStatus };
            return toggledTask;
        }
        return task;
    }));
    if (toggledTask) {
        const action = toggledTask.status === TaskStatus.DONE ? 'COMPLETE_TASK' : 'UNCOMPLETE_TASK';
        createAuditLog(user, action, `Onboarding task: "${toggledTask.title}"`);
    }
  };
  
  const openPolicyModal = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsPolicyModalOpen(true);
    setCanAcknowledge(false);
  };
  
  const handleAcknowledge = () => {
    if (selectedPolicy) {
      setPolicies(policies.map(p => p.id === selectedPolicy.id ? { ...p, acknowledged: true } : p));
      createAuditLog(user, 'ACKNOWLEDGE_POLICY', `User acknowledged policy: "${selectedPolicy.title}"`);
    }
    setIsPolicyModalOpen(false);
    setSelectedPolicy(null);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTo) {
        alert("Please fill out title, due date, and assign a user.");
        return;
    }
    const assignee = MOCK_USERS.find(u => u.id === newTask.assignedTo);
    const taskToAdd: OnboardingTask = {
        id: `ot-${new Date().getTime()}`,
        status: TaskStatus.TODO,
        ...newTask,
        estimatedTime: Number(newTask.estimatedTime),
    };
    setTasks(prevTasks => [...prevTasks, taskToAdd]);
    createAuditLog(user, 'ADD_ONBOARDING_TASK', `New task "${taskToAdd.title}" for ${assignee?.name || 'Unknown'}`);
    setIsAddTaskModalOpen(false);
    setNewTask({ title: '', category: 'Department', dueDate: '', assignedTo: MOCK_USERS.find(u => u.role === UserRole.STAFF)?.id || '', priority: 'Medium', estimatedTime: 1 });
  };

  if (!user.isNewHire && ![UserRole.MANAGER, UserRole.ADMIN].includes(user.role)) {
    return (
        <Card title="Onboarding">
            <p>Your onboarding is complete. If you need to review any policies, please visit the Learning Hub.</p>
        </Card>
    )
  }

  return (
    <div className="space-y-8">
      {user.isNewHire && unacknowledgedPolicies > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-600" role="alert">
          <p className="font-bold">Action Required</p>
          <p>You have {unacknowledgedPolicies} policies that require your acknowledgment. Please review them in the "Policy Acknowledgment" section below.</p>
        </div>
      )}
      <Card>
        <h2 className="text-2xl font-bold text-brand-primary dark:text-blue-300">Welcome to the Team, {user.name.split(' ')[0]}!</h2>
        <p className="mt-2 text-gray-600 dark:text-dark-text-secondary">Here's your personalized onboarding plan to help you get started.</p>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-brand-secondary">Onboarding Progress ({completedTasks}/{totalTasks} completed)</span>
            <span className="text-sm font-medium text-brand-secondary">{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-dark-border">
                <h3 className="text-lg font-semibold text-brand-dark dark:text-dark-text">Onboarding Checklist</h3>
                 {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
                    <Button onClick={() => setIsAddTaskModalOpen(true)}>Add Task</Button>
                )}
            </div>
            <div className="flex items-center space-x-2 mb-4">
                <label htmlFor="sort-tasks" className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Sort by:</label>
                <select id="sort-tasks" value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-gray-100 text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                    <option value="default">Default</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="estimatedTime">Time Estimate</option>
                </select>
            </div>
          <div className="space-y-4">
            {['IT', 'HR', 'Department'].map(category => {
              const categoryTasks = sortedTasks.filter(t => t.category === category);
              if (categoryTasks.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="font-semibold text-md text-gray-700 dark:text-dark-text-secondary mb-2">{category} Setup</h4>
                  <ul className="space-y-3">
                    {categoryTasks.map(task => {
                      const assignee = MOCK_USERS.find(u => u.id === task.assignedTo);
                      const dueDateInfo = getDueDateInfo(task.dueDate, task.status);
                      return (
                      <li key={task.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={task.id}
                          checked={task.status === TaskStatus.DONE}
                          onChange={() => handleToggleTask(task.id)}
                          className="h-5 w-5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary cursor-pointer flex-shrink-0"
                        />
                        <label htmlFor={task.id} className={`ml-3 text-gray-800 dark:text-dark-text ${task.status === TaskStatus.DONE ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                          {task.title}
                        </label>
                        <div className="ml-auto flex items-center space-x-3 pl-2 text-sm text-gray-500 dark:text-dark-text-secondary flex-shrink-0">
                            {dueDateInfo && (
                                <span className={`flex items-center ${dueDateInfo.className}`}>
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {dueDateInfo.text}
                                </span>
                            )}
                            <PriorityBadge priority={task.priority} />
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {task.estimatedTime}h
                            </span>
                            {assignee && [UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
                                <img 
                                    src={assignee.avatarUrl} 
                                    alt={assignee.name} 
                                    title={`Assigned to ${assignee.name}`}
                                    className="w-6 h-6 rounded-full ring-2 ring-white"
                                />
                            )}
                        </div>
                      </li>
                    )})}
                  </ul>
                </div>
              )
            })}
          </div>
        </Card>

        <Card title="Policy Acknowledgment">
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mb-4">Please review and acknowledge the following mandatory policies.</p>
            <ul className="space-y-3">
                {policies.map(policy => (
                    <li key={policy.id} className="flex justify-between items-center p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                        <span className="font-medium text-gray-800 dark:text-dark-text">{policy.title}</span>
                        {policy.acknowledged ? (
                            <span className="flex items-center text-sm text-status-success">
                                <CheckCircleIcon className="w-5 h-5 mr-1"/> Acknowledged
                            </span>
                        ) : (
                            <Button variant="secondary" onClick={() => openPolicyModal(policy)}>Review & Sign</Button>
                        )}
                    </li>
                ))}
            </ul>
        </Card>
      </div>

      <Modal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} title={selectedPolicy?.title || ''}>
        <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto p-4 border rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-dark-text-secondary">
                <h4 className="font-bold text-gray-800 dark:text-dark-text mb-2">Policy Content</h4>
                <p>This document outlines the procedures and expectations regarding this policy. All employees are required to read and understand this policy thoroughly.</p>
                <p className="mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
                 <p className="mt-4 font-semibold text-gray-700 dark:text-dark-text-secondary">Implementation Note:</p>
                <p className="text-xs">In a real application, this area would display the full policy content. For legally-binding signatures, integration with a dedicated e-signature service (e.g., DocuSign, Adobe Sign) that provides a BAA is required for full compliance.</p>
            </div>
             <div className="pt-4 mt-4 border-t dark:border-dark-border">
                <div className="flex items-center">
                    <input
                        id="acknowledge-checkbox"
                        type="checkbox"
                        checked={canAcknowledge}
                        onChange={(e) => setCanAcknowledge(e.target.checked)}
                        className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
                    />
                    <label htmlFor="acknowledge-checkbox" className="ml-2 block text-sm text-gray-900 dark:text-dark-text">
                        I confirm that I have read, understood, and agree to abide by this policy.
                    </label>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setIsPolicyModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAcknowledge} disabled={!canAcknowledge}>Acknowledge</Button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)} title="Add New Onboarding Task">
         <div className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Title</label>
                <input type="text" id="title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Category</label>
                    <select id="category" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value as any})} className="bg-gray-100 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                        <option>IT</option>
                        <option>HR</option>
                        <option>Department</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Priority</label>
                    <select id="priority" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})} className="bg-gray-100 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Due Date</label>
                    <input type="date" id="dueDate" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text" />
                </div>
                <div>
                    <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Estimated Time (hours)</label>
                    <input type="number" id="estimatedTime" min="0.5" step="0.5" value={newTask.estimatedTime} onChange={e => setNewTask({...newTask, estimatedTime: parseFloat(e.target.value)})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text" />
                </div>
            </div>
            <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Assigned To</label>
                <select id="assignedTo" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})} className="bg-gray-100 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                    {MOCK_USERS.filter(u => u.role === UserRole.STAFF).map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setIsAddTaskModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAddTask}>Add Task</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export default Onboarding;
