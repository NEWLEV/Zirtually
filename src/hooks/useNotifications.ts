import { useEffect } from 'react';
import { User, TaskStatus } from '../types';
import { MOCK_ONBOARDING_TASKS, MOCK_TRAINING } from '../constants';

export const useNotifications = (currentUser: User | null) => {
  useEffect(() => {
    if (!currentUser) return;

    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return;
      }

      if (Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted');
          }
        } catch (error) {
          console.error('Error requesting notification permission:', error);
        }
      }
    };

    const checkAndSendNotifications = () => {
      const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
      if (
        !settings.enabled ||
        !('Notification' in window) ||
        Notification.permission !== 'granted'
      ) {
        return;
      }

      const notifiedItems = new Set(JSON.parse(localStorage.getItem('notifiedItems') || '[]'));
      const newNotifiedItems = new Set(notifiedItems);

      MOCK_ONBOARDING_TASKS.forEach(task => {
        if (
          task.status !== TaskStatus.DONE &&
          !notifiedItems.has(task.id) &&
          task.assignedTo === currentUser.id
        ) {
          const dueDate = new Date(task.dueDate);
          const daysUntilDue = (dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
          if (daysUntilDue > 0 && daysUntilDue <= (settings.taskDays || 3)) {
            new Notification('Task Reminder', {
              body: `Your task "${task.title}" is due in ${Math.ceil(daysUntilDue)} days.`,
              icon: '/favicon.ico',
            });
            newNotifiedItems.add(task.id);
          }
        }
      });

      MOCK_TRAINING.forEach(module => {
        if (!module.completed && module.dueDate && !notifiedItems.has(module.id)) {
          const dueDate = new Date(module.dueDate);
          const daysUntilDue = (dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
          if (daysUntilDue > 0 && daysUntilDue <= (settings.trainingDays || 3)) {
            new Notification('Training Reminder', {
              body: `Training "${module.title}" is due in ${Math.ceil(daysUntilDue)} days.`,
              icon: '/favicon.ico',
            });
            newNotifiedItems.add(module.id);
          }
        }
      });

      localStorage.setItem('notifiedItems', JSON.stringify(Array.from(newNotifiedItems)));
    };

    requestNotificationPermission();

    const intervalId = setInterval(checkAndSendNotifications, 3600 * 1000);
    checkAndSendNotifications();

    return () => clearInterval(intervalId);
  }, [currentUser]);
};
