import React, { useState } from 'react';
import { User } from '../types';
import { useIndustry } from '../App';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Icon } from './ui/icons/Icon';

interface DocumentManagementProps {
  user: User;
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx' | 'image' | 'other';
  category: string;
  size: number; // in bytes
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  tags: string[];
  isRequired: boolean;
  status: 'current' | 'outdated' | 'pending_review' | 'archived';
  description?: string;
  version: number;
  downloadCount: number;
  sharedWith: 'everyone' | 'managers' | 'department' | 'private';
}

interface Folder {
  id: string;
  name: string;
  icon: string;
  documentCount: number;
  color: string;
}

const FOLDERS: Folder[] = [
  { id: 'policies', name: 'Policies & Procedures', icon: 'file-text', documentCount: 12, color: 'blue' },
  { id: 'onboarding', name: 'Onboarding Materials', icon: 'rocket', documentCount: 8, color: 'green' },
  { id: 'benefits', name: 'Benefits & Compensation', icon: 'gift', documentCount: 6, color: 'purple' },
  { id: 'training', name: 'Training Resources', icon: 'book-open', documentCount: 15, color: 'amber' },
  { id: 'forms', name: 'Forms & Templates', icon: 'clipboard', documentCount: 20, color: 'pink' },
  { id: 'compliance', name: 'Compliance & Legal', icon: 'shield', documentCount: 9, color: 'red' },
  { id: 'personal', name: 'My Documents', icon: 'folder', documentCount: 4, color: 'gray' },
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'Employee Handbook 2024',
    type: 'pdf',
    category: 'policies',
    size: 2500000,
    uploadedBy: 'HR Department',
    uploadedAt: '2024-01-01',
    updatedAt: '2024-01-15',
    tags: ['handbook', 'policies', 'required'],
    isRequired: true,
    status: 'current',
    description: 'Complete employee handbook with company policies, procedures, and guidelines.',
    version: 3,
    downloadCount: 245,
    sharedWith: 'everyone',
  },
  {
    id: '2',
    name: 'Benefits Enrollment Guide',
    type: 'pdf',
    category: 'benefits',
    size: 1800000,
    uploadedBy: 'Benefits Team',
    uploadedAt: '2023-11-01',
    updatedAt: '2023-12-15',
    tags: ['benefits', 'insurance', 'enrollment'],
    isRequired: true,
    status: 'current',
    description: 'Guide to enrolling in company benefits including health, dental, vision, and 401k.',
    version: 2,
    downloadCount: 189,
    sharedWith: 'everyone',
  },
  {
    id: '3',
    name: 'Code of Conduct',
    type: 'pdf',
    category: 'compliance',
    size: 850000,
    uploadedBy: 'Legal Department',
    uploadedAt: '2023-06-01',
    updatedAt: '2024-01-01',
    tags: ['compliance', 'ethics', 'required'],
    isRequired: true,
    status: 'current',
    description: 'Company code of conduct and ethics guidelines.',
    version: 4,
    downloadCount: 312,
    sharedWith: 'everyone',
  },
  {
    id: '4',
    name: 'Time Off Request Form',
    type: 'docx',
    category: 'forms',
    size: 45000,
    uploadedBy: 'HR Department',
    uploadedAt: '2023-03-15',
    updatedAt: '2023-09-20',
    tags: ['form', 'time-off', 'vacation'],
    isRequired: false,
    status: 'current',
    description: 'Standard form for requesting paid time off.',
    version: 1,
    downloadCount: 567,
    sharedWith: 'everyone',
  },
  {
    id: '5',
    name: 'Expense Report Template',
    type: 'xlsx',
    category: 'forms',
    size: 125000,
    uploadedBy: 'Finance Team',
    uploadedAt: '2023-01-10',
    updatedAt: '2023-11-05',
    tags: ['form', 'expenses', 'finance'],
    isRequired: false,
    status: 'current',
    description: 'Template for submitting expense reports.',
    version: 2,
    downloadCount: 423,
    sharedWith: 'everyone',
  },
  {
    id: '6',
    name: 'Security Awareness Training',
    type: 'pptx',
    category: 'training',
    size: 5200000,
    uploadedBy: 'IT Security',
    uploadedAt: '2024-01-10',
    updatedAt: '2024-01-10',
    tags: ['training', 'security', 'required'],
    isRequired: true,
    status: 'current',
    description: 'Annual security awareness training presentation.',
    version: 5,
    downloadCount: 198,
    sharedWith: 'everyone',
  },
  {
    id: '7',
    name: 'Remote Work Policy',
    type: 'pdf',
    category: 'policies',
    size: 650000,
    uploadedBy: 'HR Department',
    uploadedAt: '2023-08-01',
    updatedAt: '2023-12-01',
    tags: ['policy', 'remote', 'work-from-home'],
    isRequired: false,
    status: 'pending_review',
    description: 'Guidelines for remote work arrangements.',
    version: 2,
    downloadCount: 156,
    sharedWith: 'everyone',
  },
  {
    id: '8',
    name: 'Onboarding Checklist',
    type: 'docx',
    category: 'onboarding',
    size: 78000,
    uploadedBy: 'HR Department',
    uploadedAt: '2023-05-15',
    updatedAt: '2024-01-05',
    tags: ['onboarding', 'checklist', 'new-hire'],
    isRequired: false,
    status: 'current',
    description: 'Checklist for new employee onboarding tasks.',
    version: 3,
    downloadCount: 89,
    sharedWith: 'managers',
  },
  {
    id: '9',
    name: 'Performance Review Form',
    type: 'docx',
    category: 'forms',
    size: 92000,
    uploadedBy: 'HR Department',
    uploadedAt: '2023-07-01',
    updatedAt: '2024-01-10',
    tags: ['form', 'performance', 'review'],
    isRequired: false,
    status: 'current',
    description: 'Form for conducting employee performance reviews.',
    version: 2,
    downloadCount: 134,
    sharedWith: 'managers',
  },
  {
    id: '10',
    name: 'HIPAA Compliance Guide',
    type: 'pdf',
    category: 'compliance',
    size: 1200000,
    uploadedBy: 'Compliance Officer',
    uploadedAt: '2023-04-01',
    updatedAt: '2023-10-15',
    tags: ['compliance', 'hipaa', 'healthcare', 'required'],
    isRequired: true,
    status: 'outdated',
    description: 'HIPAA compliance guidelines and requirements.',
    version: 1,
    downloadCount: 276,
    sharedWith: 'everyone',
  },
];

export const DocumentManagement: React.FC<DocumentManagementProps> = ({ user }) => {
  const { config } = useIndustry();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'downloads'>('date');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: 'file-text',
      doc: 'file-text',
      docx: 'file-text',
      xls: 'table',
      xlsx: 'table',
      ppt: 'presentation',
      pptx: 'presentation',
      image: 'image',
      other: 'file',
    };
    return icons[type] || 'file';
  };

  const getFileColor = (type: string) => {
    const colors: Record<string, string> = {
      pdf: 'text-red-500 bg-red-100 dark:bg-red-900/30',
      doc: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      docx: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      xls: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      xlsx: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      ppt: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
      pptx: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
      image: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
      other: 'text-gray-500 bg-gray-100 dark:bg-gray-700',
    };
    return colors[type] || 'text-gray-500 bg-gray-100';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'outdated': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending_review': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'archived': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFolderColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      amber: 'from-amber-500 to-amber-600',
      pink: 'from-pink-500 to-pink-600',
      red: 'from-red-500 to-red-600',
      gray: 'from-gray-500 to-gray-600',
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  // Filter documents
  let filteredDocuments = MOCK_DOCUMENTS;
  
  if (selectedFolder) {
    filteredDocuments = filteredDocuments.filter(d => d.category === selectedFolder);
  }
  
  if (searchQuery) {
    filteredDocuments = filteredDocuments.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  if (filterStatus !== 'all') {
    filteredDocuments = filteredDocuments.filter(d => d.status === filterStatus);
  }

  // Sort documents
  filteredDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'downloads') return b.downloadCount - a.downloadCount;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const requiredDocs = MOCK_DOCUMENTS.filter(d => d.isRequired);
  const outdatedDocs = MOCK_DOCUMENTS.filter(d => d.status === 'outdated');
  const recentDocs = MOCK_DOCUMENTS
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="folder-open" size={32} />
            <h1 className="text-2xl font-bold">Document Center</h1>
          </div>
          <p className="text-white/80 mb-6">Access company documents, forms, and resources</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{MOCK_DOCUMENTS.length}</div>
              <div className="text-sm text-white/80">Total Documents</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{FOLDERS.length}</div>
              <div className="text-sm text-white/80">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{requiredDocs.length}</div>
              <div className="text-sm text-white/80">Required Reading</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-300">{outdatedDocs.length}</div>
              <div className="text-sm text-white/80">Needs Review</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Alert for outdated documents */}
      {outdatedDocs.length > 0 && (
        <Card variant="bordered" className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-start gap-3">
            <Icon name="alert-triangle" size={24} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">Documents Need Attention</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {outdatedDocs.length} document(s) are marked as outdated and may need to be reviewed or updated.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setFilterStatus('outdated')}>
              Review
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Folders */}
        <div className="lg:col-span-1 space-y-4">
          <Card variant="bordered" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Folders</h3>
              {selectedFolder && (
                <button 
                  onClick={() => setSelectedFolder(null)}
                  className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              {FOLDERS.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id === selectedFolder ? null : folder.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getFolderColor(folder.color)} flex items-center justify-center`}>
                    <Icon name={folder.icon} size={20} className="text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{folder.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{folder.documentCount} files</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Access */}
          <Card variant="bordered" className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Required Reading</h3>
            <div className="space-y-2">
              {requiredDocs.slice(0, 4).map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                >
                  <Icon name={getFileIcon(doc.type)} size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{doc.name}</span>
                  <Icon name="chevron-right" size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filters */}
          <Card variant="bordered" className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="current">Current</option>
                  <option value="outdated">Outdated</option>
                  <option value="pending_review">Pending Review</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="date">Latest</option>
                  <option value="name">Name</option>
                  <option value="downloads">Popular</option>
                </select>
                <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-500'}`}
                  >
                    <Icon name="grid" size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-500'}`}
                  >
                    <Icon name="list" size={18} />
                  </button>
                </div>
                {(user.role === 'Admin' || user.role === 'Manager') && (
                  <Button onClick={() => setShowUploadModal(true)}>
                    <Icon name="upload" size={18} className="mr-2" />
                    Upload
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Documents */}
          {filteredDocuments.length === 0 ? (
            <Card variant="bordered" className="p-12 text-center">
              <Icon name="folder-x" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No documents found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <Card 
                  key={doc.id} 
                  variant="bordered" 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getFileColor(doc.type)}`}>
                      <Icon name={getFileIcon(doc.type)} size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">{doc.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(doc.size)} • v{doc.version}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(doc.status)}`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                      {doc.isRequired && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Required
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(doc.updatedAt)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="bordered" className="overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Updated</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map(doc => (
                    <tr 
                      key={doc.id} 
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${getFileColor(doc.type)}`}>
                            <Icon name={getFileIcon(doc.type)} size={16} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{doc.uploadedBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(doc.status)}`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(doc.size)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(doc.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); }}>
                          <Icon name="download" size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedDocument(null)} 
          title={selectedDocument.name}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getFileColor(selectedDocument.type)}`}>
                <Icon name={getFileIcon(selectedDocument.type)} size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedDocument.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(selectedDocument.status)}`}>
                    {selectedDocument.status.replace('_', ' ')}
                  </span>
                  {selectedDocument.isRequired && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      Required
                    </span>
                  )}
                </div>
              </div>
            </div>

            {selectedDocument.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDocument.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">File Size</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatFileSize(selectedDocument.size)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Version</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedDocument.version}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded By</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedDocument.uploadedBy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedDocument.downloadCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedDocument.uploadedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedDocument.updatedAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button className="flex-1">
                <Icon name="download" size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1">
                <Icon name="eye" size={16} className="mr-2" />
                Preview
              </Button>
              <Button variant="ghost">
                <Icon name="share-2" size={16} />
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Document">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Icon name="upload-cloud" size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX up to 50MB</p>
            <Button variant="outline" className="mt-4">
              <Icon name="folder-open" size={16} className="mr-2" />
              Browse Files
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              {FOLDERS.map(folder => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Brief description of the document..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="required" className="rounded" />
            <label htmlFor="required" className="text-sm text-gray-700 dark:text-gray-300">Mark as required reading</label>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" className="flex-1" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1">
              <Icon name="upload" size={16} className="mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentManagement;
