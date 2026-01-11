import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface NotificationSettings {
  enabled: boolean;
  taskDays: number;
  trainingDays: number;
}

const Notifications: React.FC = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const savedSettings = localStorage.getItem('notificationSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        enabled: false,
        taskDays: 3,
        trainingDays: 3,
      };
    } catch (e) {
      return { enabled: false, taskDays: 3, trainingDays: 3 };
    }
  });

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const requestPermission = () => {
    Notification.requestPermission().then((status) => {
      setPermission(status);
      if (status === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }));
      } else {
        setSettings(prev => ({ ...prev, enabled: false }));
      }
    });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (checked && permission !== 'granted') {
      requestPermission();
    } else {
      setSettings(prev => ({ ...prev, enabled: checked }));
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Notification Settings</h2>
      <Card title="Browser Notifications">
        {permission === 'denied' && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            <span className="font-medium">Permission Denied.</span> You have blocked notifications for this site. To enable them, you need to change the setting in your browser.
          </div>
        )}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg dark:border-dark-border">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-dark-text">Enable Notifications</h4>
              <p className="text-sm text-gray-500 dark:text-dark-text-secondary">Receive alerts for important deadlines.</p>
            </div>
            <label htmlFor="enable-toggle" className="inline-flex relative items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="enable-toggle" 
                className="sr-only peer" 
                checked={settings.enabled && permission === 'granted'}
                onChange={handleToggle}
                disabled={permission === 'denied'}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
            </label>
          </div>

          <div className={`space-y-4 ${(!settings.enabled || permission !== 'granted') ? 'opacity-50' : ''}`}>
             <div>
                <label htmlFor="taskDays" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Onboarding Task Reminders</label>
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-2">Notify me when a task is due within:</p>
                <input
                  type="range"
                  id="taskDays"
                  name="taskDays"
                  min="1"
                  max="7"
                  value={settings.taskDays}
                  onChange={handleDaysChange}
                  disabled={!settings.enabled || permission !== 'granted'}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="text-center text-sm font-semibold">{settings.taskDays} day(s)</div>
            </div>
             <div>
                <label htmlFor="trainingDays" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Mandatory Training Reminders</label>
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary mb-2">Notify me when training is due within:</p>
                <input
                  type="range"
                  id="trainingDays"
                  name="trainingDays"
                  min="1"
                  max="7"
                  value={settings.trainingDays}
                  onChange={handleDaysChange}
                  disabled={!settings.enabled || permission !== 'granted'}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                 <div className="text-center text-sm font-semibold">{settings.trainingDays} day(s)</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
