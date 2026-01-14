import React, { useState } from 'react';
import { User, View, Notification } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { BellIcon, CheckCircleIcon } from './ui/icons/Icon';
import Breadcrumbs from './ui/Breadcrumbs';
import EmptyState from './ui/EmptyState';
import { useNotificationContext } from '../context/NotificationContext';

interface NotificationsProps {
  user: User;
  setActiveView: (view: View) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ setActiveView }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotificationContext();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'hr', label: 'HR', icon: '👥' },
    { id: 'team', label: 'Team', icon: '👫' },
    { id: 'training', label: 'Training', icon: '📚' },
    { id: 'benefits', label: 'Benefits', icon: '🎁' },
    { id: 'compliance', label: 'Compliance', icon: '✅' },
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'system', label: 'System', icon: '⚙️' },
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      case 'warning':
        return 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/10';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'action':
        return 'border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/10';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'action':
        return '🔔';
      default:
        return 'ℹ️';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📋';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications
    .filter(n => filter === 'all' || !n.read)
    .filter(n => categoryFilter === 'all' || n.category === categoryFilter);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Dashboard' }, { label: 'Notifications' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl text-white relative">
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            Notifications
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Stay updated with important alerts and messages
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="secondary" onClick={clearAll}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {notifications.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Total</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{unreadCount}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Unread</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {notifications.filter(n => n.type === 'warning').length}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Warnings</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {notifications.filter(n => n.type === 'action').length}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Actions</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="bordered">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Read/Unread Toggle */}
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === 'unread'
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex-1 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              variant="bordered"
              className={`border-l-4 ${getTypeStyles(notification.type)} ${
                !notification.read ? 'ring-1 ring-indigo-200 dark:ring-indigo-800' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">{getTypeIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4
                        className={`font-semibold ${
                          !notification.read
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-slate-300'
                        }`}
                      >
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-indigo-500 rounded-full" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-slate-500">
                        <span>{formatTime(notification.timestamp)}</span>
                        {notification.sender && (
                          <>
                            <span>•</span>
                            <span>From: {notification.sender}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(notification.category)}
                          <span className="capitalize">{notification.category}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  {notification.actionLabel && (
                    <div className="mt-3">
                      <Button size="sm" variant="secondary">
                        {notification.actionLabel}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            title={filter === 'unread' ? 'All caught up!' : 'No notifications'}
            description={
              filter === 'unread'
                ? 'You have no unread notifications at this time.'
                : 'You have no notifications in this category.'
            }
            icon="🔔"
          />
        )}
      </div>

      {/* Notification Preferences */}
      <Card variant="glass">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notification Preferences
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Customize how and when you receive notifications
            </p>
          </div>
          <Button variant="secondary">Manage Preferences</Button>
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
