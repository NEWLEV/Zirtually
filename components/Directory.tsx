import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import { DirectoryIcon, SearchIcon } from './ui/icons/Icon';
import { MOCK_USERS } from '../constants';

interface DirectoryProps {
  user: User;
}

const Directory: React.FC<DirectoryProps> = ({ user }) => {
  const { config } = useIndustry();
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const allUsers = MOCK_USERS;
  const departments = [...new Set(allUsers.map(u => u.department).filter(Boolean))];

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchesSearch = search === '' || 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.title?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || u.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [allUsers, search, selectedDepartment]);

  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, User[]> = {};
    filteredUsers.forEach(u => {
      const dept = u.department || 'Other';
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(u);
    });
    return groups;
  }, [filteredUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white">
              <DirectoryIcon className="w-6 h-6" />
            </div>
            {config.terminology.employee} Directory
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Find and connect with team members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, title, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Showing {filteredUsers.length} {config.terminology.employee.toLowerCase()}{filteredUsers.length !== 1 ? 's' : ''}
      </p>

      {/* Directory View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((person) => (
            <Card 
              key={person.id} 
              variant="bordered" 
              padding="md"
              className="hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
              onClick={() => setSelectedUser(person)}
            >
              <div className="flex flex-col items-center text-center">
                <img 
                  src={person.avatarUrl} 
                  alt={person.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gray-200 dark:ring-slate-700"
                />
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{person.name}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{person.title}</p>
                <span className="mt-2 px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full">
                  {person.department}
                </span>
                <div className="mt-4 flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="bordered">
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {Object.entries(groupedByDepartment).map(([dept, users]) => (
              <div key={dept}>
                <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {dept} ({users.length})
                  </h3>
                </div>
                {users.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(person)}
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={person.avatarUrl} 
                        alt={person.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{person.name}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{person.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden md:block text-sm text-gray-500 dark:text-slate-400">{person.email}</span>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <Card 
            variant="elevated" 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center">
              <img 
                src={selectedUser.avatarUrl} 
                alt={selectedUser.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/20"
              />
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h2>
              <p className="text-gray-500 dark:text-slate-400">{selectedUser.title}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {selectedUser.department}
                </span>
                <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full">
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-slate-300">{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-slate-300">
                  Joined {new Date(selectedUser.hireDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="flex-1">
                Send Email
              </Button>
              <Button className="flex-1">
                Message
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Directory;
