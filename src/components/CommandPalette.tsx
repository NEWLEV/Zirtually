import React, { useState, useEffect, useMemo } from 'react';
import { View } from '../types';
import {
  SearchIcon,
  DashboardIcon,
  GoalsIcon,
  LearningIcon,
  TimeOffIcon,
  TeamIcon,
  ProfileIcon,
} from './ui/icons/Icon';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (view: View) => void;
  currentView: View;
}

interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: string;
  view?: View;
  icon: React.ReactNode;
  shortcut?: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentView,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: 'dashboard',
        title: 'Dashboard',
        description: 'View your overview',
        category: 'Navigation',
        view: View.DASHBOARD,
        icon: <DashboardIcon className="w-4 h-4" />,
        shortcut: 'D',
      },
      {
        id: 'goals',
        title: 'Goals',
        description: 'Manage your goals',
        category: 'Navigation',
        view: View.GOALS,
        icon: <GoalsIcon className="w-4 h-4" />,
        shortcut: 'G',
      },
      {
        id: 'learning',
        title: 'Learning',
        description: 'Training and resources',
        category: 'Navigation',
        view: View.LEARNING,
        icon: <LearningIcon className="w-4 h-4" />,
        shortcut: 'L',
      },
      {
        id: 'timeoff',
        title: 'Time Off',
        description: 'Request and manage PTO',
        category: 'Navigation',
        view: View.TIME_OFF,
        icon: <TimeOffIcon className="w-4 h-4" />,
        shortcut: 'T',
      },
      {
        id: 'team',
        title: 'Team Hub',
        description: 'Announcements and recognition',
        category: 'Navigation',
        view: View.TEAM,
        icon: <TeamIcon className="w-4 h-4" />,
      },
      {
        id: 'directory',
        title: 'Directory',
        description: 'Find team members',
        category: 'Navigation',
        view: View.DIRECTORY,
        icon: <TeamIcon className="w-4 h-4" />,
      },
      {
        id: 'profile',
        title: 'Profile',
        description: 'View and edit your profile',
        category: 'Navigation',
        view: View.PROFILE,
        icon: <ProfileIcon className="w-4 h-4" />,
        shortcut: 'P',
      },
      {
        id: 'onboarding',
        title: 'Onboarding',
        description: 'Track onboarding progress',
        category: 'Navigation',
        view: View.ONBOARDING,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
      {
        id: 'reviews',
        title: 'Performance Reviews',
        description: 'View and complete reviews',
        category: 'Navigation',
        view: View.PERFORMANCE_REVIEWS,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
      {
        id: 'wellness',
        title: 'Wellness',
        description: 'Wellness resources',
        category: 'Navigation',
        view: View.WELLNESS,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
      {
        id: 'benefits',
        title: 'Benefits',
        description: 'View your benefits',
        category: 'Navigation',
        view: View.BENEFITS,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
      {
        id: 'surveys',
        title: 'Surveys',
        description: 'Complete surveys',
        category: 'Navigation',
        view: View.SURVEYS,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'HR analytics dashboard',
        category: 'Navigation',
        view: View.ANALYTICS,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
      {
        id: 'documents',
        title: 'Documents',
        description: 'Document management',
        category: 'Navigation',
        view: View.DOCUMENT_MANAGEMENT,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
      {
        id: 'ai',
        title: 'AI Assistant',
        description: 'Get AI-powered insights',
        category: 'Navigation',
        view: View.AI_ASSISTANT,
        icon: <GoalsIcon className="w-4 h-4" />,
      },
    ],
    []
  );

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const searchLower = search.toLowerCase();
    return commands.filter(
      cmd =>
        cmd.title.toLowerCase().includes(searchLower) ||
        cmd.description.toLowerCase().includes(searchLower) ||
        cmd.category.toLowerCase().includes(searchLower)
    );
  }, [commands, search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected?.view) {
          onSelect(selected.view);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onSelect]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Palette */}
      <div className="relative flex justify-center pt-[15vh]">
        <div
          className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-scale-in"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-slate-700">
            <SearchIcon className="w-5 h-5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search for anything..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none text-lg"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                    {category}
                  </p>
                </div>
                {items.map(cmd => {
                  const currentFlatIndex = flatIndex++;
                  const isSelected = currentFlatIndex === selectedIndex;
                  const isCurrent = cmd.view === currentView;

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => cmd.view && onSelect(cmd.view)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-900/30'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                        }`}
                      >
                        {cmd.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p
                          className={`font-medium ${
                            isSelected
                              ? 'text-indigo-900 dark:text-indigo-100'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {cmd.title}
                          {isCurrent && (
                            <span className="ml-2 text-xs text-indigo-500 dark:text-indigo-400">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {cmd.description}
                        </p>
                      </div>
                      {cmd.shortcut && (
                        <kbd className="px-2 py-1 text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 rounded">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500 dark:text-slate-400">
                  No results found for &quot;{search}&quot;
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded shadow-sm">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded shadow-sm">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded shadow-sm">↵</kbd>
                Select
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500">Powered by Zirtually</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
