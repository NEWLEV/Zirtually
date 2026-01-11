import React, { useState } from 'react';
import { User, Industry } from '../types';
import { INDUSTRY_CONFIGS } from '../constants';
import { useIndustry } from '../App';
import { ZirtuallyLogo } from './ui/icons/Icon';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const { industry, setIndustry } = useIndustry();
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);

  const industries = Object.values(INDUSTRY_CONFIGS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ZirtuallyLogo className="w-12 h-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent tracking-tight">
              Zirtually
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Employee Lifecycle Platform</p>
        </div>

        {/* Industry Selector */}
        <div className="mb-6">
          <button
            onClick={() => setShowIndustrySelector(!showIndustrySelector)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{INDUSTRY_CONFIGS[industry].icon}</span>
              <div className="text-left">
                <p className="text-sm text-slate-400">Industry</p>
                <p className="font-medium">{INDUSTRY_CONFIGS[industry].name}</p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-slate-400 transition-transform ${showIndustrySelector ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showIndustrySelector && (
            <div className="mt-2 p-2 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl animate-scale-in">
              <div className="grid grid-cols-2 gap-2">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => {
                      setIndustry(ind.id);
                      setShowIndustrySelector(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      industry === ind.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{ind.icon}</span>
                    <span className="text-sm font-medium">{ind.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Selection */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Select Profile</h2>
          <p className="text-slate-400 text-sm mb-6">Choose a user to explore the platform</p>
          
          <div className="space-y-3">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onLogin(user)}
                className="w-full group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-transparent hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all"
                  />
                  {user.isNewHire && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-md">
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.role}</p>
                  {user.department && (
                    <p className="text-xs text-slate-500">{user.department}</p>
                  )}
                </div>
                <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Powered by <span className="text-indigo-400 font-medium">Zirtually</span> • Enterprise HR Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
