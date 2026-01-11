import React, { useState } from 'react';
import { User } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import { SettingsIcon } from './ui/icons/Icon';

interface SettingsProps {
  user: User;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const { config, setIndustry, currentIndustry } = useIndustry();
  
  // Settings state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    mobile: false,
    weeklyDigest: true,
    trainingReminders: true,
    timeOffUpdates: true,
    teamUpdates: true,
    systemAlerts: true,
  });
  const [privacy, setPrivacy] = useState({
    showInDirectory: true,
    shareContactInfo: true,
    showWorkAnniversary: true,
    showBirthday: false,
    allowManagerView: true,
  });
  const [accessibility, setAccessibility] = useState({
    reduceMotion: false,
    highContrast: false,
    fontSize: 'medium',
    screenReader: false,
  });

  const industries = [
    { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
    { id: 'retail', label: 'Retail', icon: '🛒' },
    { id: 'hospitality', label: 'Hospitality', icon: '🏨' },
    { id: 'nonprofit', label: 'Non-Profit', icon: '💚' },
  ];

  const timezones = [
    { id: 'America/New_York', label: 'Eastern Time (ET)' },
    { id: 'America/Chicago', label: 'Central Time (CT)' },
    { id: 'America/Denver', label: 'Mountain Time (MT)' },
    { id: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { id: 'Europe/London', label: 'London (GMT)' },
    { id: 'Europe/Paris', label: 'Paris (CET)' },
    { id: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  ];

  const ToggleSwitch: React.FC<{
    enabled: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
  }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl text-white">
              <SettingsIcon className="w-6 h-6" />
            </div>
            Settings
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Customize your experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Theme
                </label>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t as any)}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                        theme === t
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">
                        {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'}
                      </span>
                      <span className="capitalize text-sm font-medium text-gray-900 dark:text-white">
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="pt">Português</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Regional Settings */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Regional Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {timezones.map((tz) => (
                    <option key={tz.id} value={tz.id}>{tz.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Date Format
                </label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Preferences
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              <ToggleSwitch
                enabled={notifications.email}
                onChange={(v) => setNotifications({ ...notifications, email: v })}
                label="Email Notifications"
                description="Receive notifications via email"
              />
              <ToggleSwitch
                enabled={notifications.browser}
                onChange={(v) => setNotifications({ ...notifications, browser: v })}
                label="Browser Notifications"
                description="Show desktop push notifications"
              />
              <ToggleSwitch
                enabled={notifications.mobile}
                onChange={(v) => setNotifications({ ...notifications, mobile: v })}
                label="Mobile Notifications"
                description="Receive notifications on mobile app"
              />
              <ToggleSwitch
                enabled={notifications.weeklyDigest}
                onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
                label="Weekly Digest"
                description="Receive a weekly summary email"
              />
              <ToggleSwitch
                enabled={notifications.trainingReminders}
                onChange={(v) => setNotifications({ ...notifications, trainingReminders: v })}
                label="Training Reminders"
                description="Get reminded about upcoming and due training"
              />
              <ToggleSwitch
                enabled={notifications.timeOffUpdates}
                onChange={(v) => setNotifications({ ...notifications, timeOffUpdates: v })}
                label="Time Off Updates"
                description="Notifications about time off requests"
              />
              <ToggleSwitch
                enabled={notifications.teamUpdates}
                onChange={(v) => setNotifications({ ...notifications, teamUpdates: v })}
                label="Team Updates"
                description="Notifications about team changes and announcements"
              />
              <ToggleSwitch
                enabled={notifications.systemAlerts}
                onChange={(v) => setNotifications({ ...notifications, systemAlerts: v })}
                label="System Alerts"
                description="Important system and security notifications"
              />
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Privacy Settings
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              <ToggleSwitch
                enabled={privacy.showInDirectory}
                onChange={(v) => setPrivacy({ ...privacy, showInDirectory: v })}
                label="Show in Directory"
                description="Allow others to find you in the employee directory"
              />
              <ToggleSwitch
                enabled={privacy.shareContactInfo}
                onChange={(v) => setPrivacy({ ...privacy, shareContactInfo: v })}
                label="Share Contact Information"
                description="Allow colleagues to see your contact details"
              />
              <ToggleSwitch
                enabled={privacy.showWorkAnniversary}
                onChange={(v) => setPrivacy({ ...privacy, showWorkAnniversary: v })}
                label="Show Work Anniversary"
                description="Display your work anniversary to colleagues"
              />
              <ToggleSwitch
                enabled={privacy.showBirthday}
                onChange={(v) => setPrivacy({ ...privacy, showBirthday: v })}
                label="Show Birthday"
                description="Display your birthday to colleagues"
              />
              <ToggleSwitch
                enabled={privacy.allowManagerView}
                onChange={(v) => setPrivacy({ ...privacy, allowManagerView: v })}
                label="Manager Dashboard Access"
                description="Allow your manager to view your dashboard insights"
              />
            </div>
          </Card>

          {/* Accessibility */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Accessibility
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              <ToggleSwitch
                enabled={accessibility.reduceMotion}
                onChange={(v) => setAccessibility({ ...accessibility, reduceMotion: v })}
                label="Reduce Motion"
                description="Minimize animations and transitions"
              />
              <ToggleSwitch
                enabled={accessibility.highContrast}
                onChange={(v) => setAccessibility({ ...accessibility, highContrast: v })}
                label="High Contrast"
                description="Increase contrast for better visibility"
              />
              <div className="py-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Font Size
                </label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large', 'extra-large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setAccessibility({ ...accessibility, fontSize: size })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        accessibility.fontSize === size
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <ToggleSwitch
                enabled={accessibility.screenReader}
                onChange={(v) => setAccessibility({ ...accessibility, screenReader: v })}
                label="Screen Reader Optimization"
                description="Optimize experience for screen readers"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Industry Selection */}
          <Card variant="glass">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Industry Profile
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Select your industry to customize the platform experience
            </p>
            <div className="grid grid-cols-2 gap-2">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id as any)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-left transition-colors ${
                    currentIndustry === ind.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500'
                      : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 border-2 border-transparent'
                  }`}
                >
                  <span className="text-xl">{ind.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {ind.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Account Info */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full">
                Edit Profile
              </Button>
              <Button variant="secondary" className="w-full">
                Change Password
              </Button>
              <Button variant="secondary" className="w-full">
                Two-Factor Authentication
              </Button>
            </div>
          </Card>

          {/* Data & Security */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data & Security
            </h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                Download My Data
              </Button>
              <Button variant="secondary" className="w-full">
                Active Sessions
              </Button>
              <Button variant="secondary" className="w-full">
                Security Log
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card variant="bordered" className="border-red-200 dark:border-red-900/50">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </h3>
            <div className="space-y-3">
              <Button variant="danger" className="w-full" onClick={onLogout}>
                Sign Out
              </Button>
              <Button variant="secondary" className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                Delete Account
              </Button>
            </div>
          </Card>

          {/* Help */}
          <Card variant="glass">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Help & Support
            </h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-2 p-2 text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span>📚</span> Documentation
              </a>
              <a href="#" className="flex items-center gap-2 p-2 text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span>💬</span> Contact Support
              </a>
              <a href="#" className="flex items-center gap-2 p-2 text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span>🎥</span> Video Tutorials
              </a>
              <a href="#" className="flex items-center gap-2 p-2 text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span>📝</span> Submit Feedback
              </a>
            </div>
          </Card>

          {/* Version Info */}
          <div className="text-center text-sm text-gray-400 dark:text-slate-500">
            <p>Zirtually v1.0.0</p>
            <p>© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
