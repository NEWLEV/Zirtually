import React, { useState } from 'react';
import { User, Goal, UserRole, Priority } from '../types';
import { MOCK_GOALS, MOCK_USERS, createAuditLog } from '../constants';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import Button from './ui/Button';
import Modal from './ui/Modal';

interface GoalsProps {
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

const GoalCard: React.FC<{ goal: Goal; onUpdateClick: (goal: Goal) => void }> = ({ goal, onUpdateClick }) => {
  const owner = MOCK_USERS.find(u => u.id === goal.owner);
  return (
    <Card className="flex flex-col">
      <div className="flex-grow">
          <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold text-brand-dark dark:text-dark-text">{goal.title}</h4>
              {goal.isTeamGoal && <span className="text-xs bg-brand-light text-brand-primary font-semibold px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">Team Goal</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-2 mb-4">{goal.description}</p>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-dark-text-secondary">
          <div className="flex items-center space-x-2">
              {owner && (
                  <>
                      <img src={owner.avatarUrl} alt={owner.name} className="w-6 h-6 rounded-full" />
                      <span>{owner.name}</span>
                  </>
              )}
          </div>
          <div className="flex items-center space-x-2">
              <PriorityBadge priority={goal.priority} />
              <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {goal.estimatedTime}h
              </span>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Progress</span>
              <span className="text-sm font-bold text-brand-secondary">{goal.progress}%</span>
          </div>
          <ProgressBar progress={goal.progress} />
        </div>
         <div className="pt-2 text-right">
            <Button variant="secondary" onClick={() => onUpdateClick(goal)} className="text-xs py-1 px-2">Update Progress</Button>
        </div>
      </div>
    </Card>
  );
};


const Goals: React.FC<GoalsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'myGoals' | 'teamGoals'>('myGoals');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newProgress, setNewProgress] = useState(0);

  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [newGoal, setNewGoal] = useState({
      title: '',
      description: '',
      owner: user.id,
      isTeamGoal: false,
      priority: 'Medium' as Priority,
      estimatedTime: 1,
  });

  const myGoals = goals.filter(g => g.owner === user.id && !g.isTeamGoal);
  const teamGoals = goals.filter(g => g.isTeamGoal);
  
  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.description) {
      alert('Please fill in a title and description.');
      return;
    }
    const goalToAdd: Goal = {
        id: `g-${new Date().getTime()}`,
        progress: 0,
        ...newGoal
    };
    setGoals(prev => [...prev, goalToAdd]);
    createAuditLog(user, 'ADD_GOAL', `New goal created: "${goalToAdd.title}"`);
    setIsAddModalOpen(false);
    setNewGoal({ title: '', description: '', owner: user.id, isTeamGoal: false, priority: 'Medium', estimatedTime: 1 });
  };

  const handleOpenUpdateModal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewProgress(goal.progress);
  };
  
  const handleUpdateProgress = () => {
    if (!editingGoal) return;
    
    setGoals(prevGoals => prevGoals.map(g => 
        g.id === editingGoal.id ? { ...g, progress: newProgress } : g
    ));
    
    createAuditLog(user, 'UPDATE_GOAL_PROGRESS', `Updated progress for goal "${editingGoal.title}" to ${newProgress}%.`);
    setEditingGoal(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Performance & Goals</h2>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>Add New Goal</Button>
      </div>

      <div className="border-b border-gray-200 dark:border-dark-border">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('myGoals')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'myGoals'
                ? 'border-brand-primary text-brand-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:border-gray-500'
            }`}
          >
            My Goals
          </button>
          {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
            <button
              onClick={() => setActiveTab('teamGoals')}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'teamGoals'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:border-gray-500'
              }`}
            >
              Team Goals
            </button>
          )}
        </nav>
      </div>
      
      <div>
        {activeTab === 'myGoals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGoals.length > 0 ? myGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onUpdateClick={handleOpenUpdateModal} />
            )) : <p>No personal goals set yet.</p>}
          </div>
        )}
        
        {activeTab === 'teamGoals' && [UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onUpdateClick={handleOpenUpdateModal} />
            ))}
          </div>
        )}
      </div>

       <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Goal">
         <div className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Goal Title</label>
                <input type="text" id="title" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text" />
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Description</label>
                <textarea id="description" rows={3} value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Priority</label>
                    <select id="priority" value={newGoal.priority} onChange={e => setNewGoal({...newGoal, priority: e.target.value as Priority})} className="bg-gray-100 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Estimated Time (hours)</label>
                    <input type="number" id="estimatedTime" min="1" step="1" value={newGoal.estimatedTime} onChange={e => setNewGoal({...newGoal, estimatedTime: parseFloat(e.target.value)})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text" />
                </div>
            </div>
            {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
                 <div>
                    <label htmlFor="owner" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Owner</label>
                    <select id="owner" value={newGoal.owner} onChange={e => setNewGoal({...newGoal, owner: e.target.value})} className="bg-gray-100 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text">
                        {MOCK_USERS.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
            )}
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="isTeamGoal" name="isTeamGoal" type="checkbox" checked={newGoal.isTeamGoal} onChange={e => setNewGoal({...newGoal, isTeamGoal: e.target.checked})} className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="isTeamGoal" className="font-medium text-gray-700 dark:text-dark-text">This is a team goal</label>
                    <p className="text-gray-500 dark:text-dark-text-secondary">Team goals are visible to all managers.</p>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAddGoal}>Add Goal</Button>
            </div>
         </div>
      </Modal>

      <Modal isOpen={!!editingGoal} onClose={() => setEditingGoal(null)} title={`Update Progress for "${editingGoal?.title}"`}>
        <div className="space-y-4">
            <label htmlFor="progress-slider" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Set new progress</label>
            <div className="flex items-center space-x-4">
                <input 
                    type="range" 
                    id="progress-slider" 
                    min="0" 
                    max="100" 
                    value={newProgress} 
                    onChange={(e) => setNewProgress(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="relative">
                     <input
                        type="number"
                        id="progress-input"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value) && value >= 0 && value <= 100) {
                                setNewProgress(value);
                            } else if (e.target.value === '') {
                                 setNewProgress(0);
                            }
                        }}
                        className="w-20 p-1 border border-gray-300 rounded-md text-center bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                        aria-label="Goal progress percentage"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-dark-text-secondary pointer-events-none">%</span>
                </div>
            </div>
            <div className="text-center text-3xl font-bold text-brand-secondary">{newProgress}%</div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button variant="secondary" onClick={() => setEditingGoal(null)}>Cancel</Button>
                <Button variant="primary" onClick={handleUpdateProgress}>Save Progress</Button>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default Goals;
