import React, { useState, useMemo } from 'react';
import { User, UserRole, AuditLog as AuditLogType } from '../types';
import { MOCK_AUDIT_LOGS } from '../constants';
import Card from './ui/Card';

interface AuditLogProps {
  user: User;
}

const AuditLog: React.FC<AuditLogProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('All');

  const uniqueUsers = useMemo(() => {
    const users = new Map<string, string>();
    MOCK_AUDIT_LOGS.forEach(log => {
      if (!users.has(log.user.id)) {
        users.set(log.user.id, log.user.name);
      }
    });
    return Array.from(users, ([id, name]) => ({ id, name }));
  }, []);

  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter(log => {
      const userMatch = filterUser === 'All' || log.user.id === filterUser;
      const termMatch = searchTerm === '' || 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      return userMatch && termMatch;
    });
  }, [searchTerm, filterUser]);

  if (user.role !== UserRole.ADMIN) {
    return (
      <Card title="Access Denied">
        <p>The Audit Log is only available to users with the Admin role.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">System Audit Log</h2>
      <Card>
        <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-dark-border">
          <div>
            <h3 className="text-xl font-semibold text-brand-dark dark:text-dark-text">Activity Records</h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Review key events and actions performed within the system.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="bg-gray-100 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
              aria-label="Filter by user"
            >
              <option value="All">All Users</option>
              {uniqueUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search actions or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-dark-text"
              aria-label="Search logs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-1/4">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-1/6">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider w-1/6">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{log.user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 dark:text-dark-text-secondary">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="text-center py-10 text-gray-500 dark:text-dark-text-secondary">
              <p>No log entries found matching your criteria.</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
            Log retention policies must be configured to meet the 6-year minimum required by HIPAA.
        </div>
      </Card>
    </div>
  );
};

export default AuditLog;
