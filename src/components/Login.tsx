import React, { useState, useMemo } from 'react';
import { User } from '../types';

import Button from './ui/Button';
import { useAuthContext } from '../context/AuthContext';

interface LoginProps {
  onLogin: (credentials: { email: string; password?: string }) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const { isSupabase, isLoading: authLoading, signUp } = useAuthContext();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Real Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // New for registration
  const [department, setDepartment] = useState(''); // New for registration
  const [error, setError] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(isSupabase);
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login/Register




  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return users.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        (user.department && user.department.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  const handleContinue = async () => {
    if (isLoginMode) {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      if (isRegistering && (!fullName || !department)) {
        setError('Please details for registration.');
        return;
      }

      try {
        setError(null);
        if (isRegistering) {
          await signUp({ email, password, fullName, department });
        } else {
          await onLogin({ email, password });
        }
      } catch (err: unknown) {

        const errorMsg =
          err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
        setError(errorMsg);
      }
    } else {
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        onLogin({ email: user.email });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle Background Support */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-900 to-transparent opacity-80" />
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-action-primary/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Main Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-4 shrink-0 bg-slate-900">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <img src="/zirtually-logo.png" alt="Zirtually" className="h-20 object-contain" />
            </div>

            {/* Simple Welcome - Removed Workspace Selector */}
            <div className="flex flex-col">
              {/* Optional: Add a welcoming tagline or keeps it clean */}
            </div>
          </div>


          <h1 className="text-2xl font-bold text-white mb-2">
            {isLoginMode
              ? (isRegistering ? 'Create an account' : 'Welcome back')
              : 'Choose your profile'
            }
          </h1>
          <p className="text-slate-400 text-sm">
            {isLoginMode
              ? (isRegistering
                ? 'Enter your details to get started with Zirtually.'
                : 'Sign in to access your talent and development dashboard.')
              : 'Select who you’re signing in as to continue to the platform.'}
          </p>
        </div>

        {isLoginMode ? (
          /* Real Login/Register Form */
          <div className="px-8 py-6 space-y-6 flex-1 overflow-y-auto">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-center gap-3">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}
            <div className="space-y-4">
              {isRegistering && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-action-primary/50 focus:ring-2 focus:ring-action-primary/10 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-action-primary/50 focus:ring-2 focus:ring-action-primary/10 transition-all"
                      placeholder="Engineering"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-action-primary/50 focus:ring-2 focus:ring-action-primary/10 transition-all"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Password
                  </label>
                  {!isRegistering && (
                    <button className="text-xs text-action-primary hover:text-action-primary-hover font-medium">
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 text-sm rounded-xl py-3 px-4 focus:outline-none focus:border-action-primary/50 focus:ring-2 focus:ring-action-primary/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search Section */}
            <div className="px-8 pb-4 shrink-0">
              <div className="relative group">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-action-primary group-focus-within:scale-110 transition-all duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search people, roles, or departments..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-action-primary/50 focus:ring-2 focus:ring-action-primary/20 focus:bg-slate-800 transition-all shadow-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-y-auto px-8 min-h-[300px]">
              {filteredUsers.length > 0 ? (
                <div className="space-y-2 pb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">
                    Available Profiles
                  </div>
                  {filteredUsers.map(user => {
                    const isSelected = selectedUserId === user.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`
                            group relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 outline-none
                            ${isSelected
                            ? 'bg-gradient-to-br from-action-primary/20 to-action-primary/5 border-action-primary/50 ring-1 ring-action-primary/50 shadow-lg shadow-action-primary/10 z-10 scale-[1.01]'
                            : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:shadow-md hover:scale-[1.005]'
                          }
                            `}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedUserId(user.id);
                            e.preventDefault();
                          }
                        }}
                      >
                        {/* Visual Selection Indicator (Radio/Check) */}
                        <div
                          className={`
                            w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0
                            ${isSelected
                              ? 'bg-action-primary border-action-primary text-white'
                              : 'border-slate-600 group-hover:border-slate-500 bg-slate-900/50'
                            }
                            `}
                        >
                          {isSelected && (
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>

                        <div className="relative shrink-0">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className={`
                                w-12 h-12 rounded-full object-cover ring-2 transition-all
                                ${isSelected ? 'ring-action-primary' : 'ring-transparent opacity-90 group-hover:opacity-100'}
                                `}
                          />
                          {user.isNewHire && (
                            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900 shadow-sm">
                              NEW
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-semibold text-base truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}
                            >
                              {user.name}
                            </h3>
                            {user.role === 'Admin' && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 truncate mt-0.5">
                            {user.role} <span className="text-slate-600 mx-1">·</span>{' '}
                            {user.department || 'General'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-300 font-medium">No results found</p>
                  <p className="text-sm text-slate-500 mt-1">
                    We couldn&apos;t find any profiles matching &quot;{searchQuery}&quot;
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-action-primary hover:text-action-primary-hover text-sm font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer Actions Action Bar */}
        <div className="p-6 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 flex flex-col sm:flex-row items-center gap-4 shrink-0 transition-all duration-500">
          <div className="order-2 sm:order-1 flex-1 flex items-center justify-center sm:justify-start gap-4 text-sm text-slate-400">
            {!isSupabase ? (
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="hover:text-white transition-colors"
              >
                {isLoginMode ? 'Switch to Profile Picker' : 'Sign in with Email'}
              </button>
            ) : (
              <button
                className="hover:text-white transition-colors"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                }}
              >
                {isRegistering ? 'Already have an account? Sign In' : 'Need access? Sign Up'}
              </button>
            )}
            <span className="text-slate-700">|</span>
            <button className="hover:text-white transition-colors">Help Center</button>
          </div>

          <div className="order-1 sm:order-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto min-w-[140px]"
              disabled={(!isLoginMode && !selectedUserId) || authLoading}
              onClick={handleContinue}
              loading={authLoading}
            >
              {isLoginMode ? (isRegistering ? 'Create Account' : 'Sign In') : 'Continue'}
              {isLoginMode || !selectedUserId ? null : (
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Powered By Footer - Outside Panel */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-slate-600 font-medium">
          Powered by Zirtually {isSupabase ? 'Cloud' : 'Enterprise'}
        </p>
      </div>
    </div>
  );
};

export default Login;
