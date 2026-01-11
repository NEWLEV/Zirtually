import React, { useState } from 'react';
import { User } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { SettingsIcon, SearchIcon } from './ui/icons/Icon';

interface AuditLogProps {
  user: User;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: 'user' | 'data' | 'system' | 'security' | 'compliance' | 'hr';
  details: string;
  ipAddress: string;
  status: 'success' | 'failure' | 'warning';
  affectedEntity?: string;
  metadata?: Record<string, string>;
}

const MOCK_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2025-01-15T14:32:00Z',
    userId: 'user-1',
    userName: 'Sarah Chen',
    action: 'Employee Record Updated',
    category: 'hr',
    details: 'Updated emergency contact information',
    ipAddress: '192.168.1.100',
    status: 'success',
    affectedEntity: 'Employee: John Smith',
  },
  {
    id: 'audit-2',
    timestamp: '2025-01-15T13:45:00Z',
    userId: 'user-2',
    userName: 'Michael Rodriguez',
    action: 'Document Downloaded',
    category: 'data',
    details: 'Downloaded company policy handbook',
    ipAddress: '192.168.1.101',
    status: 'success',
    affectedEntity: 'Document: Policy_Handbook_2025.pdf',
  },
  {
    id: 'audit-3',
    timestamp: '2025-01-15T12:30:00Z',
    userId: 'system',
    userName: 'System',
    action: 'Credential Expiry Alert',
    category: 'compliance',
    details: 'Automated alert sent for expiring RN license',
    ipAddress: 'system',
    status: 'warning',
    affectedEntity: 'Credential: RN License - Emily Davis',
  },
  {
    id: 'audit-4',
    timestamp: '2025-01-15T11:15:00Z',
    userId: 'user-3',
    userName: 'David Kim',
    action: 'Login Attempt',
    category: 'security',
    details: 'Failed login - incorrect password (2nd attempt)',
    ipAddress: '203.45.67.89',
    status: 'failure',
    affectedEntity: 'User: David Kim',
  },
  {
    id: 'audit-5',
    timestamp: '2025-01-15T10:00:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    action: 'Permission Changed',
    category: 'security',
    details: 'Promoted user to Manager role',
    ipAddress: '192.168.1.1',
    status: 'success',
    affectedEntity: 'User: James Wilson',
  },
  {
    id: 'audit-6',
    timestamp: '2025-01-15T09:30:00Z',
    userId: 'user-4',
    userName: 'Lisa Johnson',
    action: 'Time Off Request',
    category: 'hr',
    details: 'Submitted vacation request for Feb 10-14',
    ipAddress: '192.168.1.102',
    status: 'success',
    affectedEntity: 'Request: TIME-2025-001',
  },
  {
    id: 'audit-7',
    timestamp: '2025-01-14T16:45:00Z',
    userId: 'system',
    userName: 'System',
    action: 'Backup Completed',
    category: 'system',
    details: 'Daily database backup completed successfully',
    ipAddress: 'system',
    status: 'success',
  },
  {
    id: 'audit-8',
    timestamp: '2025-01-14T15:20:00Z',
    userId: 'user-5',
    userName: 'Robert Brown',
    action: 'Report Generated',
    category: 'data',
    details: 'Generated Q4 2024 Analytics Report',
    ipAddress: '192.168.1.103',
    status: 'success',
    affectedEntity: 'Report: Q4_Analytics_2024',
  },
  {
    id: 'audit-9',
    timestamp: '2025-01-14T14:00:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    action: 'User Account Created',
    category: 'user',
    details: 'Created new employee account',
    ipAddress: '192.168.1.1',
    status: 'success',
    affectedEntity: 'User: New Employee',
  },
  {
    id: 'audit-10',
    timestamp: '2025-01-14T11:30:00Z',
    userId: 'system',
    userName: 'System',
    action: 'Integration Sync',
    category: 'system',
    details: 'Synced data with payroll system',
    ipAddress: 'system',
    status: 'success',
    affectedEntity: 'Integration: ADP Payroll',
  },
];

const AuditLog: React.FC<AuditLogProps> = ({ user }) => {
  const { config } = useIndustry();
  const [logs] = useState<AuditEntry[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Check if user has admin access
  if (user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card variant="bordered" className="max-w-md text-center">
          <div className="p-6">
            <span className="text-5xl mb-4 block">🔒</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h2>
            <p className="text-gray-500 dark:text-slate-400">
              You don't have permission to view the audit log. Please contact your administrator.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const categories = [
    { id: 'all', label: 'All Categories', icon: '📋' },
    { id: 'user', label: 'User Actions', icon: '👤' },
    { id: 'data', label: 'Data Access', icon: '📂' },
    { id: 'system', label: 'System', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔐' },
    { id: 'compliance', label: 'Compliance', icon: '✅' },
    { id: 'hr', label: 'HR Actions', icon: '👥' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'failure': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'warning': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📋';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    failures: logs.filter(l => l.status === 'failure').length,
    warnings: logs.filter(l => l.status === 'warning').length,
  };

  const viewLogDetails = (log: AuditEntry) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl text-white">
              <SettingsIcon className="w-6 h-6" />
            </div>
            Audit Log
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            System activity and compliance tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            Export CSV
          </Button>
          <Button>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Total Events</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.success}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Successful</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.failures}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Failures</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.warnings}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Warnings</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="bordered">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="warning">Warning</option>
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card variant="bordered" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-slate-400">Timestamp</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-slate-400">User</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-slate-400">Action</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-slate-400">Category</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-600 dark:text-slate-400">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => viewLogDetails(log)}
                >
                  <td className="p-4">
                    <span className="text-sm text-gray-600 dark:text-slate-300">
                      {formatDate(log.timestamp)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-slate-300">
                        {log.userName.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{log.userName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white">{log.action}</span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                      <span>{getCategoryIcon(log.category)}</span>
                      <span className="capitalize">{log.category}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-500 dark:text-slate-400 truncate max-w-xs block">
                      {log.details}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-gray-500 dark:text-slate-400">No audit logs match your filters.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700">
          <span className="text-sm text-gray-500 dark:text-slate-400">
            Showing {filteredLogs.length} of {logs.length} entries
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>Previous</Button>
            <Button variant="secondary" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      {/* Real-time Activity */}
      <Card variant="glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Real-time Activity
          </h3>
          <span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Live
          </span>
        </div>
        <div className="space-y-3">
          {logs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
            >
              <span className="text-xl">{getCategoryIcon(log.category)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white truncate">
                  <span className="font-medium">{log.userName}</span> - {log.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {formatDate(log.timestamp)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Audit Log Details"
        size="md"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{getCategoryIcon(selectedLog.category)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {selectedLog.action}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Timestamp</p>
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedLog.timestamp)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">User</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedLog.userName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Category</p>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedLog.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">IP Address</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedLog.ipAddress}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Details</p>
              <p className="text-sm text-gray-900 dark:text-white">{selectedLog.details}</p>
            </div>

            {selectedLog.affectedEntity && (
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Affected Entity</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedLog.affectedEntity}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Button variant="secondary" className="flex-1" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button className="flex-1">
                Export Entry
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLog;
