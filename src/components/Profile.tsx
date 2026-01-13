import React, { useState } from 'react';
import { User, EmployeeSkill, ProficiencyLevel } from '../types';
import { useSettings } from '../context/SettingsContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { ProfileIcon, CheckCircleIcon } from './ui/icons/Icon';
import EmptyState from './ui/EmptyState';
import Breadcrumbs from './ui/Breadcrumbs';
import { MOCK_SKILLS, MOCK_CREDENTIALS } from '../constants';
import { View } from '../types';

interface ProfileProps {
  user: User;
  onUserUpdate: (user: User) => void;
  setActiveView: (view: View) => void;
}

interface ProfileSkill {
  skillId: string;
  name: string;
  category: string;
  proficiency: number;
  isVerified: boolean;
  endorsements: string[];
  id?: string;
}

const Profile: React.FC<ProfileProps> = ({ user, onUserUpdate, setActiveView }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'credentials' | 'documents' | 'settings'
  >('overview');

  // Modal states
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddCredentialOpen, setIsAddCredentialOpen] = useState(false);

  // Use Global Settings
  const { notifications, updateNotifications, privacy, updatePrivacy } = useSettings();

  // Form states
  const [newSkill, setNewSkill] = useState({ name: '', category: 'technical', proficiency: 3 });
  const [newCredential, setNewCredential] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    id: '',
  });

  // Form Validation State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Handlers
  const handleAvatarClick = () => setIsAvatarUploadOpen(true);
  const handleAddSkillClick = () => setIsAddSkillOpen(true);
  const handleAddCredentialClick = () => setIsAddCredentialOpen(true);

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) {
      setFormErrors(prev => ({ ...prev, skillName: 'Skill name is required' }));
      return;
    }
    setFormErrors({});

    const skill: EmployeeSkill = {
      employeeId: user.id,
      skillId: `s-${Date.now()}`,
      proficiency: newSkill.proficiency as ProficiencyLevel,
      verified: false,
      endorsements: [],
    };

    onUserUpdate({
      ...user,
      employeeSkills: [...(user.employeeSkills || []), skill],
    });
    setIsAddSkillOpen(false);
    setNewSkill({ name: '', category: 'technical', proficiency: 3 });
  };

  const handleSaveCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCredential.name || !newCredential.issuer) return;

    onUserUpdate({
      ...user,
      credentials: [
        ...(user.credentials || []),
        {
          ...newCredential,
          id: `c-${Date.now()}`,
          status: 'Active',
          verificationUrl: '#',
        },
      ],
    });
    setIsAddCredentialOpen(false);
    setNewCredential({ name: '', issuer: '', issueDate: '', expiryDate: '', id: '' });
  };

  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '(555) 123-4567',
    location: user.location || 'San Francisco, CA',
    bio: user.bio || 'Passionate professional dedicated to excellence and continuous improvement.',
    emergencyContact: 'Jane Doe - (555) 987-6543',
  });

  // Merge mock data with user-specific data
  const userSkills = [
    ...(user.employeeSkills || []).map(es => {
      const skillInfo = MOCK_SKILLS.find(s => s.id === es.skillId);
      return {
        ...es,
        name: skillInfo?.name || es.skillId,
        category: skillInfo?.category || 'technical',
        isVerified: !!es.verified,
        endorsements: es.endorsements || [],
      };
    }),
    ...(user.skills || []).map((s, i) => ({
      skillId: `us-${i}`,
      name: s,
      category: 'technical',
      proficiency: 4 as ProficiencyLevel,
      isVerified: true,
      endorsements: [],
    })),
  ];

  const userCredentials = [
    ...(user.credentials || []),
    ...MOCK_CREDENTIALS.filter(c => c.userId === user.id),
  ];

  const handleSave = () => {
    onUserUpdate({ ...user, name: editForm.name, email: editForm.email });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'documents', label: 'Documents' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Personal' }, { label: 'My Profile' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-action-primary to-action-secondary rounded-xl text-text-inverse">
              <ProfileIcon className="w-6 h-6" />
            </div>
            My Profile
          </h1>
          <p className="text-text-tertiary dark:text-dark-text-secondary mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {activeTab === 'overview' && (
          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card variant="glass" className="relative overflow-hidden">
        {/* Background Banner */}
        <div className="absolute inset-0 h-32 bg-gradient-to-r from-action-primary via-action-secondary to-focus-ring" />

        <div className="relative pt-16 px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-bg-elevated dark:ring-dark-bg shadow-xl"
              />
              {isEditing && (
                <button
                  className="absolute bottom-2 right-2 p-2 bg-action-primary text-text-inverse rounded-full shadow-lg hover:bg-action-primary-hover transition-colors"
                  onClick={handleAvatarClick}
                  data-testid="avatar-camera-button"
                >
                  <span className="text-sm">📷</span>
                </button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text">
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 text-sm font-bold bg-action-secondary/10 text-action-secondary border border-action-secondary/20 rounded-full">
                    {user.department}
                  </span>
                  {user.role === 'Admin' ? (
                    <span className="px-3 py-1 text-sm font-bold bg-status-info/10 text-status-info border border-status-info/20 rounded-full">
                      {user.role}
                    </span>
                  ) : user.role === 'Executive' ? (
                    <span className="px-3 py-1 text-sm font-bold bg-action-primary/10 text-action-primary border border-action-primary/20 rounded-full">
                      {user.role}
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm font-bold bg-bg-secondary text-text-secondary border border-border-medium rounded-full">
                      {user.role}
                    </span>
                  )}
                  {user.isNewHire && (
                    <span className="px-3 py-1 text-sm font-bold bg-status-success/10 text-status-success border border-status-success/20 rounded-full">
                      New Hire
                    </span>
                  )}
                </div>
              </div>
              <p className="text-text-tertiary dark:text-dark-text-secondary text-lg flex items-center justify-center md:justify-start gap-2">
                {user.title} • {user.location || 'San Francisco, CA'}
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <p className="text-sm text-text-tertiary dark:text-dark-text-secondary">
                Joined{' '}
                {user.startDate
                  ? new Date(user.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
              {user.managerId && (
                <p className="text-sm text-text-tertiary dark:text-dark-text-secondary">
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-action-primary text-action-primary'
                  : 'border-transparent text-text-tertiary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text'
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
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-focus-ring"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-focus-ring"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-focus-ring"
                    />
                  ) : (
                    <p className="font-medium text-gray-900 dark:text-white">{editForm.location}</p>
                  )}
                </div>
              </div>
            </Card>

            <Card variant="bordered">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About Me</h3>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
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
                  onChange={e => setEditForm({ ...editForm, emergencyContact: e.target.value })}
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
                    {user.startDate
                      ? Math.floor(
                          (new Date().getTime() - new Date(user.startDate).getTime()) /
                            (1000 * 60 * 60 * 24 * 365)
                        )
                      : 0}{' '}
                    years
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
                {userSkills.slice(0, 5).map((skill: ProfileSkill, index: number) => (
                  <div key={skill.id || skill.skillId} data-testid={`top-skill-${index}`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-slate-300">
                        {skill.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        Level {skill.proficiency}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-action-primary to-action-secondary rounded-full"
                        style={{
                          width: `${(skill.proficiency / 5) * 100}%`,
                        }}
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
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddSkillClick}
              data-testid="add-skill-button"
            >
              Add Skill
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSkills.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  title="No skills added yet"
                  description="Highlight your expertise by adding skills to your profile."
                  actionLabel="Add First Skill"
                  onAction={handleAddSkillClick}
                />
              </div>
            ) : (
              userSkills.map((skill: ProfileSkill) => (
                <div
                  key={skill.id || skill.skillId}
                  className="p-4 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-text-primary dark:text-dark-text">
                        {skill.name}
                      </p>
                      <p className="text-sm text-text-tertiary dark:text-dark-text-secondary capitalize">
                        {skill.category}
                      </p>
                    </div>
                    {skill.isVerified && (
                      <CheckCircleIcon className="w-5 h-5 text-status-success" />
                    )}
                  </div>
                  {skill.proficiency > 0 && (
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(level => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full ${
                            level <= skill.proficiency
                              ? 'bg-action-primary'
                              : 'bg-gray-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  {skill.endorsements?.length > 0 && (
                    <p className="text-xs text-text-tertiary dark:text-dark-text-secondary mt-2">
                      {skill.endorsements.length} endorsement
                      {skill.endorsements.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {activeTab === 'credentials' && (
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Credentials & Certifications
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddCredentialClick}
              data-testid="add-credential-button"
            >
              Add Credential
            </Button>
          </div>
          <div className="space-y-4">
            {userCredentials.length === 0 ? (
              <EmptyState
                title="No credentials found"
                description="Add certifications or licenses to showcase your qualifications."
                actionLabel="Add Credential"
                onAction={handleAddCredentialClick}
              />
            ) : (
              userCredentials.map(credential => (
                <div
                  key={credential.id}
                  className="p-4 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-text-primary dark:text-dark-text">
                        {credential.name}
                      </p>
                      <p className="text-sm text-text-tertiary dark:text-dark-text-secondary">
                        {credential.issuer}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary dark:text-dark-text-secondary">
                        <span>Issued: {new Date(credential.issueDate).toLocaleDateString()}</span>
                        {credential.expiryDate && (
                          <span>
                            Expires: {new Date(credential.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        credential.status === 'Active'
                          ? 'bg-status-success/10 text-status-success border border-status-success/20'
                          : credential.status === 'Expiring Soon'
                            ? 'bg-status-warning/10 text-status-warning border border-status-warning/20'
                            : 'bg-status-error/10 text-status-error border border-status-error/20'
                      }`}
                    >
                      {credential.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">
              My Documents
            </h3>
            <div className="flex gap-2">
              <input
                type="file"
                id="doc-upload"
                className="hidden"
                onChange={e => {
                  if (e.target.files?.[0]) alert('Uploading: ' + e.target.files[0].name);
                }}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById('doc-upload')?.click()}
              >
                Upload Document
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {[
              {
                id: 'd1',
                name: 'Employment Contract',
                type: 'Contract',
                date: '2023-01-15',
                size: '1.2 MB',
              },
              { id: 'd2', name: 'W-4 Form', type: 'Tax Form', date: '2023-01-15', size: '450 KB' },
              {
                id: 'd3',
                name: 'Direct Deposit Auth',
                type: 'Finance',
                date: '2023-01-15',
                size: '280 KB',
              },
              {
                id: 'd4',
                name: 'Performance Review - 2023',
                type: 'Review',
                date: '2023-12-20',
                size: '890 KB',
              },
            ].map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-action-primary/10 text-action-primary rounded-lg text-xl">
                    📄
                  </div>
                  <div>
                    <p className="font-medium text-text-primary dark:text-dark-text">{doc.name}</p>
                    <p className="text-xs text-text-tertiary dark:text-dark-text-secondary">
                      {doc.type} • {new Date(doc.date).toLocaleDateString()} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Downloading ' + doc.name)}
                  >
                    Download
                  </Button>
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
                {
                  label: 'Email notifications for tasks',
                  value: notifications.email,
                  key: 'email',
                },
                { label: 'Browser notifications', value: notifications.browser, key: 'browser' },
                {
                  label: 'Weekly digest emails',
                  value: notifications.weeklyDigest,
                  key: 'weeklyDigest',
                },
                {
                  label: 'Training reminders',
                  value: notifications.trainingReminders,
                  key: 'trainingReminders',
                },
                {
                  label: 'Time off approval updates',
                  value: notifications.timeOffUpdates,
                  key: 'timeOffUpdates',
                },
              ].map((pref, index) => (
                <div
                  key={pref.label}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <span className="text-gray-700 dark:text-slate-300">{pref.label}</span>
                  <button
                    onClick={() =>
                      updateNotifications({ [pref.key as keyof typeof notifications]: !pref.value })
                    }
                    data-testid={`notification-toggle-${index}`}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      pref.value ? 'bg-action-primary' : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        pref.value ? 'translate-x-6' : 'translate-x-0.5'
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
                {
                  label: 'Show profile in directory',
                  value: privacy.showInDirectory,
                  key: 'showInDirectory',
                },
                {
                  label: 'Allow contact info sharing',
                  value: privacy.shareContactInfo,
                  key: 'shareContactInfo',
                },
                {
                  label: 'Display work anniversary',
                  value: privacy.showWorkAnniversary,
                  key: 'showWorkAnniversary',
                },
              ].map(pref => (
                <div
                  key={pref.label}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <span className="text-gray-700 dark:text-slate-300">{pref.label}</span>
                  <button
                    onClick={() =>
                      updatePrivacy({ [pref.key as keyof typeof privacy]: !pref.value })
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      pref.value ? 'bg-action-primary' : 'bg-gray-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        pref.value ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isAvatarUploadOpen}
        onClose={() => setIsAvatarUploadOpen(false)}
        title="Update Profile Picture"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-slate-300">TODO: Implement drag and drop upload</p>
          <Button onClick={() => setIsAvatarUploadOpen(false)}>Cancel</Button>
        </div>
      </Modal>

      <Modal isOpen={isAddSkillOpen} onClose={() => setIsAddSkillOpen(false)} title="Add New Skill">
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Skill Name
            </label>
            <input
              type="text"
              required
              value={newSkill.name}
              onChange={e => {
                setNewSkill({ ...newSkill, name: e.target.value });
                if (e.target.value.trim()) setFormErrors(prev => ({ ...prev, skillName: '' }));
              }}
              className={`w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none ${
                formErrors.skillName
                  ? 'border-status-error'
                  : 'border-border-light dark:border-dark-border'
              }`}
              placeholder="e.g. React, Project Management..."
            />
            {formErrors.skillName && (
              <p className="mt-1 text-xs text-status-error">{formErrors.skillName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Category
            </label>
            <select
              value={newSkill.category}
              onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
            >
              <option value="technical">Technical</option>
              <option value="soft_skills">Soft Skills</option>
              <option value="leadership">Leadership</option>
              <option value="industry_specific">Industry Specific</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Proficiency (1-5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={newSkill.proficiency}
              onChange={e => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-action-primary"
            />
            <div className="flex justify-between text-xs text-text-tertiary mt-1">
              <span>Novice</span>
              <span>Expert</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" className="flex-1" onClick={() => setIsAddSkillOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Skill
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAddCredentialOpen}
        onClose={() => setIsAddCredentialOpen(false)}
        title="Add Credential"
      >
        <form onSubmit={handleSaveCredential} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Credential Name
            </label>
            <input
              type="text"
              required
              value={newCredential.name}
              onChange={e => setNewCredential({ ...newCredential, name: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Issuer
            </label>
            <input
              type="text"
              required
              value={newCredential.issuer}
              onChange={e => setNewCredential({ ...newCredential, issuer: e.target.value })}
              className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={newCredential.issueDate}
                onChange={e => setNewCredential({ ...newCredential, issueDate: e.target.value })}
                className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={newCredential.expiryDate}
                onChange={e => setNewCredential({ ...newCredential, expiryDate: e.target.value })}
                className="w-full px-4 py-2 bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border rounded-xl focus:ring-2 focus:ring-focus-ring outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsAddCredentialOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Credential
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
