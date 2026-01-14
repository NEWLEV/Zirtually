import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'action',
    category: 'hr',
    title: 'Time Off Request Approved',
    message: 'Your vacation request for February 10-14 has been approved by your manager.',
    timestamp: '2025-01-15T14:30:00Z',
    read: false,
    actionUrl: '/time-off',
    actionLabel: 'View Details',
    sender: 'Sarah Chen',
  },
  {
    id: 'notif-2',
    type: 'warning',
    category: 'compliance',
    title: 'Credential Expiring Soon',
    message: 'Your CPR certification expires in 30 days. Please renew to maintain compliance.',
    timestamp: '2025-01-15T12:00:00Z',
    read: false,
    actionUrl: '/credentialing',
    actionLabel: 'Renew Now',
  },
  {
    id: 'notif-3',
    type: 'info',
    category: 'training',
    title: 'New Training Assigned',
    message: 'You have been assigned "Advanced Leadership Skills" training. Due by March 1, 2025.',
    timestamp: '2025-01-15T10:00:00Z',
    read: false,
    actionUrl: '/learning',
    actionLabel: 'Start Training',
    sender: 'Learning & Development',
  },
  {
    id: 'notif-4',
    type: 'success',
    category: 'personal',
    title: 'Goal Completed',
    message:
      'Congratulations! You\'ve completed your Q4 goal "Complete project management certification".',
    timestamp: '2025-01-14T16:00:00Z',
    read: true,
    actionUrl: '/goals',
    actionLabel: 'View Goals',
  },
  {
    id: 'notif-5',
    type: 'info',
    category: 'team',
    title: 'New Team Member',
    message: 'Jessica Martinez has joined your team as Senior Developer. Welcome them!',
    timestamp: '2025-01-14T09:00:00Z',
    read: true,
    actionUrl: '/directory',
    actionLabel: 'View Profile',
    sender: 'HR Team',
  },
  {
    id: 'notif-6',
    type: 'action',
    category: 'hr',
    title: 'Performance Review Scheduled',
    message: 'Your annual performance review is scheduled for January 25, 2025 at 2:00 PM.',
    timestamp: '2025-01-13T14:00:00Z',
    read: true,
    actionUrl: '/performance',
    actionLabel: 'Add to Calendar',
    sender: 'Michael Rodriguez',
  },
  {
    id: 'notif-7',
    type: 'info',
    category: 'benefits',
    title: 'Open Enrollment Reminder',
    message: 'Open enrollment starts March 1st. Review your current benefits before then.',
    timestamp: '2025-01-13T08:00:00Z',
    read: true,
    actionUrl: '/benefits',
    actionLabel: 'Review Benefits',
    sender: 'Benefits Team',
  },
  {
    id: 'notif-8',
    type: 'success',
    category: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    timestamp: '2025-01-12T15:30:00Z',
    read: true,
  },
  {
    id: 'notif-9',
    type: 'warning',
    category: 'training',
    title: 'Training Due Soon',
    message: 'Your "Security Awareness 2025" training is due in 7 days.',
    timestamp: '2025-01-12T10:00:00Z',
    read: true,
    actionUrl: '/learning',
    actionLabel: 'Complete Training',
  },
  {
    id: 'notif-10',
    type: 'info',
    category: 'system',
    title: 'System Maintenance',
    message:
      'Scheduled maintenance on January 20, 2025 from 2-4 AM EST. System may be unavailable.',
    timestamp: '2025-01-11T08:00:00Z',
    read: true,
    sender: 'IT Team',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('zirtually_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
    return MOCK_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('zirtually_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
