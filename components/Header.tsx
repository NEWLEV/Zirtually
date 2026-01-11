import React from 'react';
import { User } from '../types';
import Button from './ui/Button';
import { SunIcon, MoonIcon, SearchIcon, LogoutIcon, NotificationsIcon } from './ui/icons/Icon';
import { useIndustry } from '../App';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onOpenCommandPalette: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, setTheme, onOpenCommandPalette }) => {
  const { config } = useIndustry();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Greeting and Search */}
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getGreeting()}, {user.name.split(' ')[0]}
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Center - Search */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-3 px-4 py-2 w-80 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-slate-600"
        >
          <SearchIcon className="w-4 h-4" />
          <span className="text-sm">Search or jump to...</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-gray-400 dark:text-slate-500">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded shadow-sm border border-gray-200 dark:border-slate-600">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded shadow-sm border border-gray-200 dark:border-slate-600">K</kbd>
          </span>
        </button>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <NotificationsIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-2" />

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{user.role}</p>
            </div>
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
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
