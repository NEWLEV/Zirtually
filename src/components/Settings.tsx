import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, View, Industry } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { SettingsIcon } from './ui/icons/Icon';

import { useSettings, Theme, FontSize } from '../context/SettingsContext';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  setActiveView?: (view: View) => void;
}

const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}> = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
      {description && <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-action-primary' : 'bg-border-medium dark:bg-dark-border'
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

const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
  const { setIndustry, industry: currentIndustry } = useIndustry();
  const navigate = useNavigate();

  // Use Global Settings
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    timezone,
    setTimezone,
    dateFormat,
    setDateFormat,
    notifications,
    updateNotifications,
    privacy,
    updatePrivacy,
    accessibility,
    updateAccessibility,
  } = useSettings();

  // Modal states
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);
  const [isActiveSessionsOpen, setIsActiveSessionsOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  // Handlers
  const handleEditProfileClick = () => navigate('/edit-profile');
  const handleChangePasswordClick = () => setIsChangePasswordOpen(true);
  const handleTwoFactorClick = () => setIsTwoFactorOpen(true);
  const handleDownloadDataClick = () => {
    // Check if downloadUserData is available globally or implement it
    console.log('Downloading user data...');
    alert('Download started');
  };
  const handleActiveSessionsClick = () => setIsActiveSessionsOpen(true);
  const handleSecurityLogClick = () => navigate('/security-log');
  const handleDeleteAccountClick = () => setIsDeleteAccountOpen(true);

  /* Removed local state definitions */

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

  /* ToggleSwitch moved to top level */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-action-primary to-action-secondary rounded-xl text-text-inverse">
              <SettingsIcon className="w-6 h-6" />
            </div>
            Settings
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Customize your experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance */}
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Theme
                </label>
                <div className="flex gap-3">
                  {['light', 'dark', 'system'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t as Theme)}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                        theme === t
                          ? 'border-action-primary bg-action-primary/10'
                          : 'border-border-light dark:border-dark-border hover:border-border-medium dark:hover:border-dark-border/80'
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
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full p-3 bg-bg-secondary dark:bg-dark-card rounded-xl text-text-primary dark:text-dark-text outline-none focus:ring-2 focus:ring-focus-ring"
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
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full p-3 bg-bg-secondary dark:bg-dark-card rounded-xl text-text-primary dark:text-dark-text outline-none focus:ring-2 focus:ring-focus-ring"
                >
                  {timezones.map(tz => (
                    <option key={tz.id} value={tz.id}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Date Format
                </label>
                <select
                  value={dateFormat}
                  onChange={e => setDateFormat(e.target.value)}
                  className="w-full p-3 bg-bg-secondary dark:bg-dark-card rounded-xl text-text-primary dark:text-dark-text outline-none focus:ring-2 focus:ring-focus-ring"
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
                onChange={v => updateNotifications({ email: v })}
                label="Email Notifications"
                description="Receive notifications via email"
              />
              <ToggleSwitch
                enabled={notifications.browser}
                onChange={v => updateNotifications({ browser: v })}
                label="Browser Notifications"
                description="Show desktop push notifications"
              />
              <ToggleSwitch
                enabled={notifications.mobile}
                onChange={v => updateNotifications({ mobile: v })}
                label="Mobile Notifications"
                description="Receive notifications on mobile app"
              />
              <ToggleSwitch
                enabled={notifications.weeklyDigest}
                onChange={v => updateNotifications({ weeklyDigest: v })}
                label="Weekly Digest"
                description="Receive a weekly summary email"
              />
              <ToggleSwitch
                enabled={notifications.trainingReminders}
                onChange={v => updateNotifications({ trainingReminders: v })}
                label="Training Reminders"
                description="Get reminded about upcoming and due training"
              />
              <ToggleSwitch
                enabled={notifications.timeOffUpdates}
                onChange={v => updateNotifications({ timeOffUpdates: v })}
                label="Time Off Updates"
                description="Notifications about time off requests"
              />
              <ToggleSwitch
                enabled={notifications.teamUpdates}
                onChange={v => updateNotifications({ teamUpdates: v })}
                label="Team Updates"
                description="Notifications about team changes and announcements"
              />
              <ToggleSwitch
                enabled={notifications.systemAlerts}
                onChange={v => updateNotifications({ systemAlerts: v })}
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
                onChange={v => updatePrivacy({ showInDirectory: v })}
                label="Show in Directory"
                description="Allow others to find you in the employee directory"
              />
              <ToggleSwitch
                enabled={privacy.shareContactInfo}
                onChange={v => updatePrivacy({ shareContactInfo: v })}
                label="Share Contact Information"
                description="Allow colleagues to see your contact details"
              />
              <ToggleSwitch
                enabled={privacy.showWorkAnniversary}
                onChange={v => updatePrivacy({ showWorkAnniversary: v })}
                label="Show Work Anniversary"
                description="Display your work anniversary to colleagues"
              />
              <ToggleSwitch
                enabled={privacy.showBirthday}
                onChange={v => updatePrivacy({ showBirthday: v })}
                label="Show Birthday"
                description="Display your birthday to colleagues"
              />
              <ToggleSwitch
                enabled={privacy.allowManagerView}
                onChange={v => updatePrivacy({ allowManagerView: v })}
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
                onChange={v => updateAccessibility({ reduceMotion: v })}
                label="Reduce Motion"
                description="Minimize animations and transitions"
              />
              <ToggleSwitch
                enabled={accessibility.highContrast}
                onChange={v => updateAccessibility({ highContrast: v })}
                label="High Contrast"
                description="Increase contrast for better visibility"
              />
              <div className="py-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Font Size
                </label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large', 'extra-large'].map(size => (
                    <button
                      key={size}
                      onClick={() => updateAccessibility({ fontSize: size as FontSize })}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                        accessibility.fontSize === size
                          ? 'bg-action-secondary/10 text-action-secondary'
                          : 'bg-bg-secondary dark:bg-dark-card text-text-secondary dark:text-dark-text-secondary hover:bg-border-light dark:hover:bg-dark-border'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <ToggleSwitch
                enabled={accessibility.screenReader}
                onChange={v => updateAccessibility({ screenReader: v })}
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
              {industries.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id as Industry)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-left transition-colors ${
                    currentIndustry === ind.id
                      ? 'bg-action-primary/10 border-2 border-action-primary'
                      : 'bg-bg-secondary dark:bg-dark-card hover:bg-border-light dark:hover:bg-dark-border border-2 border-transparent'
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-bg-secondary dark:bg-dark-card rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-action-primary to-action-secondary flex items-center justify-center text-text-inverse font-bold shadow-md">
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleEditProfileClick}
                data-testid="edit-profile-button"
              >
                Edit Profile
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleChangePasswordClick}
                data-testid="change-password-button"
              >
                Change Password
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleTwoFactorClick}
                data-testid="two-factor-button"
              >
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
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleDownloadDataClick}
                data-testid="download-data-button"
              >
                Download My Data
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleActiveSessionsClick}
                data-testid="active-sessions-button"
              >
                Active Sessions
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleSecurityLogClick}
                data-testid="security-log-button"
              >
                Security Log
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card variant="bordered" className="border-status-error/30 dark:border-status-error/30">
            <h3 className="text-lg font-semibold text-status-error mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <Button
                variant="danger"
                className="w-full"
                onClick={onLogout}
                data-testid="sign-out-button"
              >
                Sign Out
              </Button>
              <Button
                variant="secondary"
                className="w-full text-status-error hover:bg-status-error/10"
                onClick={handleDeleteAccountClick}
                data-testid="delete-account-button"
              >
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
              <a
                href="#"
                className="flex items-center gap-2 p-2 text-text-tertiary hover:text-action-primary transition-colors"
              >
                <span>📚</span> Documentation
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 text-text-tertiary hover:text-action-primary transition-colors"
              >
                <span>💬</span> Contact Support
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 text-text-tertiary hover:text-action-primary transition-colors"
              >
                <span>🎥</span> Video Tutorials
              </a>
              <a
                href="#"
                className="flex items-center gap-2 p-2 text-text-tertiary hover:text-action-primary transition-colors"
              >
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

      {/* Modals */}
      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Change Password"
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            alert('Password updated successfully!');
            setIsChangePasswordOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsChangePasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isTwoFactorOpen}
        onClose={() => setIsTwoFactorOpen(false)}
        title="Two-Factor Authentication"
      >
        <div className="space-y-4">
          <div className="p-4 bg-status-info/10 rounded-xl border border-status-info/20">
            <p className="text-sm text-status-info font-medium">
              Two-factor authentication adds an extra layer of security to your account.
            </p>
          </div>
          <div className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-dark-card rounded-xl border border-border-light dark:border-dark-border">
            <div>
              <p className="font-bold text-text-primary dark:text-dark-text">Authenticator App</p>
              <p className="text-sm text-text-tertiary dark:text-dark-text-secondary">
                Use an app like Google Authenticator
              </p>
            </div>
            <Button size="sm">Enable</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-dark-card rounded-xl border border-border-light dark:border-dark-border opacity-50">
            <div>
              <p className="font-bold text-text-primary dark:text-dark-text">SMS Authentication</p>
              <p className="text-sm text-text-tertiary dark:text-dark-text-secondary">
                Receive codes via text message
              </p>
            </div>
            <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-500 rounded-full px-2 py-1">
              Coming Soon
            </span>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setIsTwoFactorOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isActiveSessionsOpen}
        onClose={() => setIsActiveSessionsOpen(false)}
        title="Active Sessions"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-slate-300">TODO: List active sessions</p>
          <Button onClick={() => setIsActiveSessionsOpen(false)}>Close</Button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-slate-300">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteAccountOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                /* TODO: Implement delete */ setIsDeleteAccountOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
