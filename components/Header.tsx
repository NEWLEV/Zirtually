import React from 'react';
import { User } from '../types';
import Button from './ui/Button';
import { SunIcon, MoonIcon } from './ui/icons/Icon';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white dark:bg-dark-card shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-dark-border">
      <div>
        <h2 className="text-2xl font-bold text-brand-dark dark:text-dark-text">Welcome back, {user.name.split(' ')[0]}!</h2>
        <p className="text-gray-500 dark:text-dark-text-secondary">Here's your overview for today.</p>
      </div>
      <div className="flex items-center space-x-6">
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
        <div className="flex items-center space-x-3">
          <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full border-2 border-brand-primary" />
          <div>
            <p className="font-semibold text-gray-800 dark:text-dark-text">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{user.role}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={onLogout} className="py-2 px-3 text-sm">
            Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;