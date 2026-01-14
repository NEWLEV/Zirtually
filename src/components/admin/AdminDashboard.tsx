import React, { useState } from 'react';
import { User, View } from '../../types';
import Card from '../ui/Card';
import Breadcrumbs from '../ui/Breadcrumbs';
import AdminEmployees from './AdminEmployees';
import AdminStructure from './AdminStructure'; // For Departments & Positions
import AdminSettings from './AdminSettings';

interface AdminDashboardProps {
  user: User;
  setActiveView: (view: View) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, setActiveView }) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'structure' | 'settings'>('employees');

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Admin' }, { label: 'Console' }]}
        setActiveView={setActiveView}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Console</h1>
          <p className="text-gray-500 dark:text-slate-400">
            Manage your organization's people, structure, and configuration.
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('employees')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'employees'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'structure'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Structure (Depts & Positions)
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Global Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'employees' && <AdminEmployees />}
        {activeTab === 'structure' && <AdminStructure user={user} />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
