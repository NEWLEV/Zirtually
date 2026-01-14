import React from 'react';
import { User, View } from '../types';
import Button from './ui/Button';
import { SunIcon, MoonIcon, SearchIcon, LogoutIcon, NotificationsIcon } from './ui/icons/Icon';
import { Theme } from '../context/SettingsContext';
import { useNotificationContext } from '../context/NotificationContext';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onOpenCommandPalette: () => void;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  theme,
  setTheme,
  onOpenCommandPalette,
  setActiveView,
}) => {
  const { unreadCount } = useNotificationContext();
  const toggleTheme = () => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'light' : 'dark');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const effectiveTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <header className="sticky top-0 z-30 bg-bg-elevated/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-border-light dark:border-dark-border transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Greeting and Search */}
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text">
              {getGreeting()}, {user.name.split(' ')[0]}
            </h2>
            <p className="text-sm text-text-tertiary dark:text-dark-text-secondary">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-3 px-4 py-2 w-80 bg-bg-secondary dark:bg-dark-card rounded-xl text-text-tertiary dark:text-dark-text-secondary hover:bg-border-light dark:hover:bg-dark-border/50 transition-colors border border-border-light dark:border-dark-border"
        >
          <SearchIcon className="w-4 h-4" />
          <span className="text-sm">Search or jump to...</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-text-tertiary dark:text-dark-text-secondary">
            <kbd className="px-1.5 py-0.5 bg-bg-elevated dark:bg-dark-bg rounded shadow-sm border border-border-medium dark:border-dark-border text-[10px] font-bold">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-bg-elevated dark:bg-dark-bg rounded shadow-sm border border-border-medium dark:border-dark-border text-[10px] font-bold">
              K
            </kbd>
          </span>
        </button>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => setActiveView(View.NOTIFICATIONS)}
            className="relative p-2 rounded-xl text-text-tertiary dark:text-dark-text-secondary hover:bg-bg-secondary dark:hover:bg-dark-card transition-colors"
            aria-label="Notifications"
          >
            <NotificationsIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-tertiary dark:text-dark-text-secondary hover:bg-bg-secondary dark:hover:bg-dark-card transition-colors"
            aria-label="Toggle theme"
          >
            {effectiveTheme === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-border-light dark:bg-dark-border mx-2" />

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-text-primary dark:text-dark-text">
                {user.name}
              </p>
              <p className="text-xs text-text-tertiary dark:text-dark-text-secondary">
                {user.role}
              </p>
            </div>
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-action-primary/30"
            />
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="ml-2"
            icon={<LogoutIcon className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
