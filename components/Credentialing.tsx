import React, { useState } from 'react';
import { User, Credential } from '../types';
import { useIndustry } from '../App';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { ProgressBar } from './ui/ProgressBar';
import { Icon } from './ui/icons/Icon';

interface CredentialingProps {
  user: User;
}

interface CredentialApplication {
  id: string;
  credentialType: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'pending_documents';
  submittedDate?: string;
  lastUpdated: string;
  completionPercentage: number;
  requiredDocuments: {
    name: string;
    status: 'uploaded' | 'pending' | 'rejected';
    uploadedDate?: string;
    notes?: string;
  }[];
  reviewer?: string;
  estimatedCompletion?: string;
}

const MOCK_CREDENTIALS: Credential[] = [
  {
    id: '1',
    name: 'Medical License',
    type: 'license',
    issuer: 'State Medical Board',
    issueDate: '2020-06-15',
    expiryDate: '2025-06-15',
    status: 'active',
    verificationUrl: 'https://verify.medboard.gov/12345',
  },
  {
    id: '2',
    name: 'Board Certification - Internal Medicine',
    type: 'certification',
    issuer: 'American Board of Internal Medicine',
    issueDate: '2019-09-01',
    expiryDate: '2029-09-01',
    status: 'active',
  },
  {
    id: '3',
    name: 'DEA Registration',
    type: 'license',
    issuer: 'Drug Enforcement Administration',
    issueDate: '2021-01-10',
    expiryDate: '2024-01-10',
    status: 'expiring_soon',
  },
  {
    id: '4',
    name: 'BLS Certification',
    type: 'certification',
    issuer: 'American Heart Association',
    issueDate: '2022-03-20',
    expiryDate: '2024-03-20',
    status: 'expired',
  },
  {
    id: '5',
    name: 'HIPAA Compliance Training',
    type: 'certification',
    issuer: 'Healthcare Compliance Institute',
    issueDate: '2023-11-01',
    expiryDate: '2024-11-01',
    status: 'active',
  },
  {
    id: '6',
    name: 'State Controlled Substance License',
    type: 'license',
    issuer: 'State Pharmacy Board',
    issueDate: '2021-05-15',
    expiryDate: '2024-05-15',
    status: 'active',
  },
];

const MOCK_APPLICATIONS: CredentialApplication[] = [
  {
    id: '1',
    credentialType: 'Hospital Privileges - Metro General',
    status: 'under_review',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-02-01',
    completionPercentage: 80,
    requiredDocuments: [
      { name: 'Medical License Copy', status: 'uploaded', uploadedDate: '2024-01-15' },
      { name: 'Board Certification', status: 'uploaded', uploadedDate: '2024-01-15' },
      { name: 'Malpractice Insurance', status: 'uploaded', uploadedDate: '2024-01-16' },
      { name: 'References (3)', status: 'uploaded', uploadedDate: '2024-01-18' },
      { name: 'Background Check Authorization', status: 'pending' },
    ],
    reviewer: 'Credentialing Committee',
    estimatedCompletion: '2024-02-28',
  },
  {
    id: '2',
    credentialType: 'Insurance Panel - BlueCross BlueShield',
    status: 'pending_documents',
    lastUpdated: '2024-01-25',
    completionPercentage: 60,
    requiredDocuments: [
      { name: 'W-9 Form', status: 'uploaded', uploadedDate: '2024-01-20' },
      { name: 'NPI Verification', status: 'uploaded', uploadedDate: '2024-01-20' },
      { name: 'Practice Address Verification', status: 'rejected', notes: 'Document expired, please upload current version' },
      { name: 'DEA Certificate', status: 'pending' },
    ],
  },
  {
    id: '3',
    credentialType: 'Telemedicine License - California',
    status: 'approved',
    submittedDate: '2023-11-01',
    lastUpdated: '2023-12-15',
    completionPercentage: 100,
    requiredDocuments: [
      { name: 'Application Form', status: 'uploaded', uploadedDate: '2023-11-01' },
      { name: 'Home State License', status: 'uploaded', uploadedDate: '2023-11-01' },
      { name: 'Jurisprudence Exam Results', status: 'uploaded', uploadedDate: '2023-11-10' },
    ],
    reviewer: 'California Medical Board',
  },
];

const CREDENTIAL_REQUIREMENTS = [
  { category: 'Core Licenses', items: ['State Medical License', 'DEA Registration', 'Controlled Substance License'] },
  { category: 'Board Certifications', items: ['Primary Specialty', 'Subspecialty (if applicable)'] },
  { category: 'Training Certifications', items: ['BLS', 'ACLS', 'HIPAA Training'] },
  { category: 'Insurance & Liability', items: ['Malpractice Insurance', 'Professional Liability'] },
];

export const Credentialing: React.FC<CredentialingProps> = ({ user }) => {
  const { config } = useIndustry();
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'applications' | 'requirements'>('overview');
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CredentialApplication | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Check if credentialing feature is enabled for this industry
  if (!config.features.credentialing) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card variant="bordered" className="p-8 text-center max-w-md">
          <Icon name="shield-off" size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Credentialing Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Credentialing management is not enabled for {config.name} industry configuration.
          </p>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'expiring_soon': case 'pending_documents': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'expired': case 'denied': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'under_review': case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': case 'approved': return 'check-circle';
      case 'expiring_soon': return 'alert-triangle';
      case 'expired': case 'denied': return 'x-circle';
      case 'under_review': return 'clock';
      case 'pending_documents': return 'file-text';
      case 'draft': return 'edit';
      default: return 'circle';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeCredentials = MOCK_CREDENTIALS.filter(c => c.status === 'active').length;
  const expiringCredentials = MOCK_CREDENTIALS.filter(c => c.status === 'expiring_soon').length;
  const expiredCredentials = MOCK_CREDENTIALS.filter(c => c.status === 'expired').length;
  const pendingApplications = MOCK_APPLICATIONS.filter(a => a.status !== 'approved' && a.status !== 'denied').length;

  const filteredCredentials = filterStatus === 'all' 
    ? MOCK_CREDENTIALS 
    : MOCK_CREDENTIALS.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="shield-check" size={32} />
            <h1 className="text-2xl font-bold">Credentialing Center</h1>
          </div>
          <p className="text-white/80 mb-6">Manage your licenses, certifications, and credentialing applications</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{activeCredentials}</div>
              <div className="text-sm text-white/80">Active Credentials</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-300">{expiringCredentials}</div>
              <div className="text-sm text-white/80">Expiring Soon</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-300">{expiredCredentials}</div>
              <div className="text-sm text-white/80">Expired</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{pendingApplications}</div>
              <div className="text-sm text-white/80">Pending Applications</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Alert Banner for Expiring/Expired */}
      {(expiringCredentials > 0 || expiredCredentials > 0) && (
        <Card variant="bordered" className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <Icon name="alert-triangle" size={24} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">Attention Required</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                You have {expiringCredentials} credential(s) expiring soon and {expiredCredentials} expired credential(s). 
                Please initiate renewal processes to maintain compliance.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowRenewalModal(true)}>
              View Details
            </Button>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: 'layout-dashboard' },
          { id: 'credentials', label: 'My Credentials', icon: 'award' },
          { id: 'applications', label: 'Applications', icon: 'file-text' },
          { id: 'requirements', label: 'Requirements', icon: 'clipboard-list' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Expirations */}
          <div className="lg:col-span-2">
            <Card variant="glass" className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Expirations</h2>
              <div className="space-y-3">
                {MOCK_CREDENTIALS
                  .filter(c => c.status === 'expiring_soon' || c.status === 'expired')
                  .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                  .map(credential => {
                    const daysLeft = getDaysUntilExpiry(credential.expiryDate);
                    return (
                      <div key={credential.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            credential.status === 'expired' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                          }`}>
                            <Icon 
                              name={credential.status === 'expired' ? 'x-circle' : 'alert-triangle'} 
                              size={20} 
                              className={credential.status === 'expired' ? 'text-red-500' : 'text-amber-500'}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{credential.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {credential.status === 'expired' 
                                ? `Expired ${formatDate(credential.expiryDate)}`
                                : `Expires in ${daysLeft} days`}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant={credential.status === 'expired' ? 'primary' : 'outline'}>
                          {credential.status === 'expired' ? 'Renew Now' : 'Start Renewal'}
                        </Button>
                      </div>
                    );
                  })}
                {MOCK_CREDENTIALS.filter(c => c.status === 'expiring_soon' || c.status === 'expired').length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Icon name="check-circle" size={48} className="mx-auto mb-2 text-green-500" />
                    <p>All credentials are up to date!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="plus" size={18} className="mr-2" />
                  Add New Credential
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="upload" size={18} className="mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="file-text" size={18} className="mr-2" />
                  Start Application
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Icon name="download" size={18} className="mr-2" />
                  Export Report
                </Button>
              </div>
            </Card>

            <Card variant="bordered" className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compliance Status</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Overall Compliance</span>
                    <span className="font-medium text-gray-900 dark:text-white">85%</span>
                  </div>
                  <ProgressBar value={85} max={100} color="emerald" />
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    1 expired credential affecting compliance score
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            {['all', 'active', 'expiring_soon', 'expired'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCredentials.map(credential => (
              <Card 
                key={credential.id} 
                variant="bordered" 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCredential(credential)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      credential.type === 'license' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      <Icon 
                        name={credential.type === 'license' ? 'file-badge' : 'award'} 
                        size={20} 
                        className={credential.type === 'license' ? 'text-blue-600' : 'text-purple-600'}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{credential.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{credential.issuer}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(credential.status)}`}>
                    <Icon name={getStatusIcon(credential.status)} size={12} className="inline mr-1" />
                    {credential.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Issue Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(credential.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Expiry Date</p>
                    <p className={`font-medium ${
                      credential.status === 'expired' ? 'text-red-600' : 
                      credential.status === 'expiring_soon' ? 'text-amber-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatDate(credential.expiryDate)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Credentialing Applications</h2>
            <Button>
              <Icon name="plus" size={18} className="mr-2" />
              New Application
            </Button>
          </div>

          <div className="space-y-4">
            {MOCK_APPLICATIONS.map(application => (
              <Card 
                key={application.id} 
                variant="bordered" 
                className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{application.credentialType}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: {formatDate(application.lastUpdated)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    <Icon name={getStatusIcon(application.status)} size={12} className="inline mr-1" />
                    {application.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Completion</span>
                    <span className="font-medium text-gray-900 dark:text-white">{application.completionPercentage}%</span>
                  </div>
                  <ProgressBar 
                    value={application.completionPercentage} 
                    max={100} 
                    color={application.completionPercentage === 100 ? 'green' : 'blue'} 
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      <Icon name="file-text" size={14} className="inline mr-1" />
                      {application.requiredDocuments.filter(d => d.status === 'uploaded').length}/{application.requiredDocuments.length} documents
                    </span>
                    {application.reviewer && (
                      <span className="text-gray-500 dark:text-gray-400">
                        <Icon name="user" size={14} className="inline mr-1" />
                        {application.reviewer}
                      </span>
                    )}
                  </div>
                  {application.estimatedCompletion && (
                    <span className="text-gray-500 dark:text-gray-400">
                      Est. completion: {formatDate(application.estimatedCompletion)}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Requirements Tab */}
      {activeTab === 'requirements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CREDENTIAL_REQUIREMENTS.map((category, index) => (
            <Card key={index} variant="bordered" className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{category.category}</h3>
              <div className="space-y-3">
                {category.items.map((item, itemIndex) => {
                  const credential = MOCK_CREDENTIALS.find(c => c.name.includes(item.split(' ')[0]));
                  const hasCredential = !!credential && credential.status === 'active';
                  
                  return (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon 
                          name={hasCredential ? 'check-circle' : 'circle'} 
                          size={20} 
                          className={hasCredential ? 'text-green-500' : 'text-gray-400'}
                        />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                      {!hasCredential && (
                        <Button size="sm" variant="ghost">
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <Modal isOpen={true} onClose={() => setSelectedCredential(null)} title={selectedCredential.name}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCredential.status)}`}>
                {selectedCredential.status.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{selectedCredential.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Issuer</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedCredential.issuer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedCredential.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                <p className={`font-medium ${
                  selectedCredential.status === 'expired' ? 'text-red-600' : 'text-gray-900 dark:text-white'
                }`}>
                  {formatDate(selectedCredential.expiryDate)}
                </p>
              </div>
              {selectedCredential.verificationUrl && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Verification</p>
                  <a href={selectedCredential.verificationUrl} className="text-emerald-600 hover:underline text-sm">
                    Verify Online →
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="flex-1">
                <Icon name="download" size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1">
                <Icon name="edit" size={16} className="mr-2" />
                Edit
              </Button>
              {selectedCredential.status !== 'active' && (
                <Button className="flex-1">
                  <Icon name="refresh-cw" size={16} className="mr-2" />
                  Renew
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedApplication(null)} 
          title={selectedApplication.credentialType}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                {selectedApplication.status.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedApplication.completionPercentage}% complete
              </span>
            </div>

            <ProgressBar value={selectedApplication.completionPercentage} max={100} color="emerald" />

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Required Documents</h4>
              <div className="space-y-2">
                {selectedApplication.requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon 
                        name={doc.status === 'uploaded' ? 'check-circle' : doc.status === 'rejected' ? 'x-circle' : 'circle'} 
                        size={18} 
                        className={
                          doc.status === 'uploaded' ? 'text-green-500' : 
                          doc.status === 'rejected' ? 'text-red-500' : 'text-gray-400'
                        }
                      />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{doc.name}</p>
                        {doc.uploadedDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Uploaded: {formatDate(doc.uploadedDate)}
                          </p>
                        )}
                        {doc.notes && (
                          <p className="text-xs text-red-600 dark:text-red-400">{doc.notes}</p>
                        )}
                      </div>
                    </div>
                    {doc.status !== 'uploaded' && (
                      <Button size="sm" variant="outline">Upload</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedApplication.estimatedCompletion && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <Icon name="calendar" size={14} className="inline mr-1" />
                  Estimated completion: {formatDate(selectedApplication.estimatedCompletion)}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Renewal Alert Modal */}
      <Modal isOpen={showRenewalModal} onClose={() => setShowRenewalModal(false)} title="Credentials Requiring Attention">
        <div className="space-y-4">
          {MOCK_CREDENTIALS
            .filter(c => c.status === 'expiring_soon' || c.status === 'expired')
            .map(credential => (
              <div key={credential.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{credential.name}</p>
                  <p className={`text-sm ${credential.status === 'expired' ? 'text-red-600' : 'text-amber-600'}`}>
                    {credential.status === 'expired' 
                      ? `Expired ${formatDate(credential.expiryDate)}`
                      : `Expires ${formatDate(credential.expiryDate)}`}
                  </p>
                </div>
                <Button size="sm">Renew</Button>
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default Credentialing;
