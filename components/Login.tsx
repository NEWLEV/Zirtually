import React from 'react';
import { User } from '../types';
import Card from './ui/Card';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-brand-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <h1 className="text-3xl font-bold tracking-tight text-brand-dark dark:text-dark-text ml-2">MedStaff Connect</h1>
            </div>
            <h2 className="text-xl text-gray-600 dark:text-dark-text-secondary">Select a profile to sign in</h2>
        </div>
        <Card className="p-8">
          <div className="space-y-4">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onLogin(user)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-brand-primary hover:bg-brand-light dark:border-dark-border dark:hover:bg-dark-border transition-all duration-200 flex items-center space-x-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={`Log in as ${user.name}`}
              >
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full" />
                <div>
                  <p className="font-semibold text-lg text-gray-800 dark:text-dark-text">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;