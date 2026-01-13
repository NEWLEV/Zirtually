import React, { useState } from 'react';
import { User, TimeOffRequest, TimeOffType, TimeOffStatus, View } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { TimeOffIcon, PlusIcon, CheckCircleIcon } from './ui/icons/Icon';
import { MOCK_TIME_OFF_REQUESTS, MOCK_HOLIDAYS } from '../constants';
import { useAuditLogs } from '../context/AuditLogContext';

interface TimeOffProps {
  user: User;
  setActiveView?: (view: View) => void;
}

const TimeOff: React.FC<TimeOffProps> = ({ user, setActiveView: _setActiveView }) => {
  const { config: _config } = useIndustry();
  const [requests, setRequests] = useState<TimeOffRequest[]>(MOCK_TIME_OFF_REQUESTS);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedType, setSelectedType] = useState<TimeOffType>('pto');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const balances = {
    pto: {
      used: user.timeOffBalance?.used.pto || 0,
      total: user.timeOffBalance?.pto || 0,
      label: 'PTO Days',
    },
    sick: {
      used: user.timeOffBalance?.used.sick || 0,
      total: user.timeOffBalance?.sick || 0,
      label: 'Sick Days',
    },
    personal: {
      used: user.timeOffBalance?.used.personal || 0,
      total: user.timeOffBalance?.personal || 0,
      label: 'Personal Days',
    },
    bereavement: {
      used: user.timeOffBalance?.used.bereavement || 0,
      total: user.timeOffBalance?.bereavement || 0,
      label: 'Bereavement',
    },
  };

  const getStatusColor = (status: TimeOffStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400';
    }
  };

  const getTypeIcon = (type: TimeOffType) => {
    switch (type) {
      case 'vacation':
        return '🏖️';
      case 'sick':
        return '🏥';
      case 'personal':
        return '🏠';
      case 'bereavement':
        return '💐';
      case 'parental':
        return '👶';
      case 'jury_duty':
        return '⚖️';
      case 'military':
        return '🎖️';
      default:
        return '📅';
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const upcomingRequests = requests.filter(
    r => r.status === 'approved' && new Date(r.startDate) > new Date()
  );

  const { logAction } = useAuditLogs();

  const handleSubmit = () => {
    const days =
      Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    const newRequest: TimeOffRequest = {
      id: Date.now().toString(),
      employeeId: user.id,
      type: selectedType,
      startDate,
      endDate,
      totalDays: days,
      status: 'pending',
      notes,
      requestedAt: new Date().toISOString(),
    };

    setRequests([newRequest, ...requests]);
    logAction(
      user,
      'REQUEST_TIME_OFF',
      'hr',
      `Requested ${days} days of ${selectedType}`,
      'success',
      `Request ID: ${newRequest.id}`
    );

    setShowNewRequest(false);
    setStartDate('');
    setEndDate('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white">
              <TimeOffIcon className="w-6 h-6" />
            </div>
            Time Off
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage your time off requests and balances
          </p>
        </div>
        <Button onClick={() => setShowNewRequest(true)} icon={<PlusIcon className="w-4 h-4" />}>
          New Request
        </Button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(balances).map(([key, balance]) => (
          <Card key={key} variant="glass" padding="md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{getTypeIcon(key as TimeOffType)}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">{balance.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {balance.total - balance.used}
              </span>
              <span className="text-sm text-gray-500 dark:text-slate-400">
                / {balance.total} days
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                style={{ width: `${((balance.total - balance.used) / balance.total) * 100}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Pending Requests Alert */}
      {pendingRequests.length > 0 && (
        <Card variant="elevated" className="border-l-4 border-l-amber-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {pendingRequests.length} Pending Request{pendingRequests.length > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Awaiting manager approval</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Requests
            </h3>
            <div className="space-y-3">
              {requests.slice(0, 10).map(request => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getTypeIcon(request.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {request.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {new Date(request.startDate).toLocaleDateString()} -{' '}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 dark:text-slate-400">
                      {request.totalDays} day{request.totalDays > 1 ? 's' : ''}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">📅</span>
                  <p className="text-gray-500 dark:text-slate-400">No time off requests yet</p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => setShowNewRequest(true)}
                  >
                    Create Your First Request
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Time Off */}
          {upcomingRequests.length > 0 && (
            <Card variant="glass">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                Upcoming Time Off
              </h3>
              <div className="space-y-3">
                {upcomingRequests.slice(0, 3).map(request => (
                  <div key={request.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {request.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {new Date(request.startDate).toLocaleDateString()} ({request.totalDays} days)
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Company Holidays */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Company Holidays
            </h3>
            <div className="space-y-3">
              {MOCK_HOLIDAYS.slice(0, 5).map(holiday => (
                <div key={holiday.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎉</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{holiday.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {new Date(holiday.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Policy Info */}
          <Card variant="glass">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Policy Highlights
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Requests should be submitted 2+ weeks in advance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Unused vacation days roll over (max 5 days)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                Sick days require documentation after 3 consecutive days
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={showNewRequest}
        onClose={() => setShowNewRequest(false)}
        title="Request Time Off"
        size="md"
      >
        <div className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Type of Leave
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['pto', 'sick', 'personal', 'bereavement'] as TimeOffType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                    selectedType === type
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl">{getTypeIcon(type)}</span>
                  <span
                    className={`font-medium capitalize ${
                      selectedType === type
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    {type.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
            />
          </div>

          {/* Balance Info */}
          {selectedType && balances[selectedType as keyof typeof balances] && (
            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Available balance:{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {balances[selectedType as keyof typeof balances].total -
                    balances[selectedType as keyof typeof balances].used}{' '}
                  days
                </span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNewRequest(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!startDate || !endDate}>
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TimeOff;
