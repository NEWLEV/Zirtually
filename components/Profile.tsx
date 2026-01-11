import React, { useState } from 'react';
import { User, EmployeeSkill } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import { ProfileIcon, CheckCircleIcon } from './ui/icons/Icon';
import { MOCK_SKILLS, MOCK_CREDENTIALS } from '../constants';

interface ProfileProps {
  user: User;
  setUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const { config } = useIndustry();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'credentials' | 'settings'>('overview');
  
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate professional dedicated to excellence and continuous improvement.',
    emergencyContact: 'Jane Doe - (555) 987-6543',
  });

  const userSkills = MOCK_SKILLS.filter(s => s.userId === user.id);
  const userCredentials = MOCK_CREDENTIALS.filter(c => c.userId === user.id);

  const handleSave = () => {
    setUser({ ...user, name: editForm.name, email: editForm.email });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl text-white">
              <ProfileIcon className="w-6 h-6" />
            </div>
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {activeTab === 'overview' && (
          <Button 
            variant={isEditing ? 'secondary' : 'primary'}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card variant="glass" className="relative overflow-hidden">
        {/* Background Banner */}
        <div className="absolute inset-0 h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />
        
        <div className="relative pt-16 px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl"
              />
              {isEditing && (
                <button className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                  <span className="text-sm">📷</span>
                </button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-slate-400">{user.title}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                <span className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                  {user.department}
                </span>
                <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-full">
                  {user.role}
                </span>
                {user.isNewHire && (
                  <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    New Hire
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Joined {new Date(user.hireDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
              {user.managerId && (
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Reports to: Team Lead
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="bordered">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.location}</p>
                  )}
                </div>
              </div>
            </Card>

            <Card variant="bordered">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600 dark:text-slate-300">{editForm.bio}</p>
              )}
            </Card>

            <Card variant="bordered">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Emergency Contact
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.emergencyContact}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-600 dark:text-slate-300">{editForm.emergencyContact}</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card variant="glass">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Tenure</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.floor((new Date().getTime() - new Date(user.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Goals</span>
                  <span className="font-medium text-gray-900 dark:text-white">3 Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Training</span>
                  <span className="font-medium text-gray-900 dark:text-white">2 Pending</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-slate-400">Time Off</span>
                  <span className="font-medium text-gray-900 dark:text-white">15 days left</span>
                </div>
              </div>
            </Card>

            <Card variant="bordered">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Skills
              </h3>
              <div className="space-y-3">
                {userSkills.slice(0, 5).map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-slate-300">{skill.name}</span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">Level {skill.proficiencyLevel}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        style={{ width: `${(skill.proficiencyLevel / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Skills & Competencies
            </h3>
            <Button variant="secondary" size="sm">
              Add Skill
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSkills.map((skill) => (
              <div key={skill.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{skill.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 capitalize">{skill.category}</p>
                  </div>
                  {skill.isVerified && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full ${
                        level <= skill.proficiencyLevel
                          ? 'bg-indigo-500'
                          : 'bg-gray-200 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                {skill.endorsements.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    {skill.endorsements.length} endorsement{skill.endorsements.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'credentials' && (
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Credentials & Certifications
            </h3>
            <Button variant="secondary" size="sm">
              Add Credential
            </Button>
          </div>
          <div className="space-y-4">
            {userCredentials.map((credential) => (
              <div key={credential.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{credential.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {credential.issuingOrganization}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
                      <span>Issued: {new Date(credential.issueDate).toLocaleDateString()}</span>
                      {credential.expiryDate && (
                        <span>Expires: {new Date(credential.expiryDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    credential.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : credential.status === 'expiring_soon'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {credential.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Email notifications for tasks', enabled: true },
                { label: 'Browser notifications', enabled: true },
                { label: 'Weekly digest emails', enabled: false },
                { label: 'Training reminders', enabled: true },
                { label: 'Time off approval updates', enabled: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-gray-700 dark:text-slate-300">{pref.label}</span>
                  <button 
                    className={`w-12 h-6 rounded-full transition-colors ${
                      pref.enabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  >
                    <span 
                      className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        pref.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="bordered">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Privacy Settings
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Show profile in directory', enabled: true },
                { label: 'Allow contact info sharing', enabled: true },
                { label: 'Display work anniversary', enabled: true },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-gray-700 dark:text-slate-300">{pref.label}</span>
                  <button 
                    className={`w-12 h-6 rounded-full transition-colors ${
                      pref.enabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  >
                    <span 
                      className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        pref.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
