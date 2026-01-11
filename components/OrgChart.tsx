import React, { useState } from 'react';
import { User, TeamMember } from '../types';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { TeamIcon, SearchIcon } from './ui/icons/Icon';
import { MOCK_TEAM_MEMBERS } from '../constants';

interface OrgChartProps {
  user: User;
}

interface OrgNode {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  department: string;
  email: string;
  phone?: string;
  reportsTo?: string;
  directReports: string[];
  level: number;
}

// Transform team members into org hierarchy
const buildOrgHierarchy = (members: TeamMember[]): OrgNode[] => {
  // Create CEO/top level
  const orgNodes: OrgNode[] = [
    {
      id: 'ceo',
      name: 'Alexandra Mitchell',
      title: 'Chief Executive Officer',
      department: 'Executive',
      email: 'a.mitchell@company.com',
      directReports: ['vp-eng', 'vp-ops', 'vp-hr', 'cfo'],
      level: 0,
    },
    {
      id: 'vp-eng',
      name: 'James Wilson',
      title: 'VP of Engineering',
      department: 'Engineering',
      email: 'j.wilson@company.com',
      reportsTo: 'ceo',
      directReports: ['eng-1', 'eng-2'],
      level: 1,
    },
    {
      id: 'vp-ops',
      name: 'Sarah Chen',
      title: 'VP of Operations',
      department: 'Operations',
      email: 's.chen@company.com',
      reportsTo: 'ceo',
      directReports: ['ops-1', 'ops-2'],
      level: 1,
    },
    {
      id: 'vp-hr',
      name: 'Michael Rodriguez',
      title: 'VP of Human Resources',
      department: 'Human Resources',
      email: 'm.rodriguez@company.com',
      reportsTo: 'ceo',
      directReports: ['hr-1'],
      level: 1,
    },
    {
      id: 'cfo',
      name: 'Emily Davis',
      title: 'Chief Financial Officer',
      department: 'Finance',
      email: 'e.davis@company.com',
      reportsTo: 'ceo',
      directReports: ['fin-1'],
      level: 1,
    },
  ];

  // Add team members as lower level nodes
  members.forEach((member, index) => {
    const parentId = ['vp-eng', 'vp-ops', 'vp-hr', 'cfo'][index % 4];
    orgNodes.push({
      id: `member-${member.id}`,
      name: member.name,
      title: member.title,
      avatar: member.avatar,
      department: member.department,
      email: member.email,
      reportsTo: parentId,
      directReports: [],
      level: 2,
    });
  });

  return orgNodes;
};

const OrgChart: React.FC<OrgChartProps> = ({ user }) => {
  const { config } = useIndustry();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ceo']));

  const orgNodes = buildOrgHierarchy(MOCK_TEAM_MEMBERS);

  const filteredNodes = searchQuery
    ? orgNodes.filter(node =>
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orgNodes;

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const viewProfile = (node: OrgNode) => {
    setSelectedNode(node);
    setShowProfileModal(true);
  };

  const getNodeById = (id: string) => orgNodes.find(n => n.id === id);
  const getChildren = (nodeId: string) => orgNodes.filter(n => n.reportsTo === nodeId);

  const stats = {
    totalEmployees: orgNodes.length,
    departments: new Set(orgNodes.map(n => n.department)).size,
    levels: Math.max(...orgNodes.map(n => n.level)) + 1,
  };

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      'Executive': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300',
      'Engineering': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300',
      'Operations': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300',
      'Human Resources': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-300',
      'Finance': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300',
    };
    return colors[dept] || 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-400 border-gray-300';
  };

  // Render org node card
  const OrgNodeCard: React.FC<{ node: OrgNode; showChildren?: boolean }> = ({ node, showChildren = true }) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div className="flex flex-col items-center">
        {/* Node Card */}
        <div
          className={`relative p-4 bg-white dark:bg-slate-800 rounded-xl border-2 ${getDepartmentColor(node.department)} shadow-sm hover:shadow-md transition-all cursor-pointer min-w-48`}
          onClick={() => viewProfile(node)}
        >
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold mb-2">
              {node.avatar ? (
                <img src={node.avatar} alt={node.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                node.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{node.name}</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{node.title}</p>
            <span className={`mt-2 px-2 py-0.5 text-xs rounded-full ${getDepartmentColor(node.department)}`}>
              {node.department}
            </span>
          </div>

          {/* Expand/Collapse button */}
          {hasChildren && showChildren && (
            <button
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>

        {/* Children */}
        {showChildren && hasChildren && isExpanded && (
          <>
            {/* Connector Line */}
            <div className="w-0.5 h-6 bg-gray-300 dark:bg-slate-600" />
            
            {/* Children Container */}
            <div className="flex gap-4 pt-2">
              {children.length > 1 && (
                <div className="absolute h-0.5 bg-gray-300 dark:bg-slate-600" 
                  style={{
                    width: `calc(${(children.length - 1) * 208}px)`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: 'calc(100% + 24px)',
                  }}
                />
              )}
              {children.map(child => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-gray-300 dark:bg-slate-600" />
                  <OrgNodeCard node={child} showChildren={true} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white">
              <TeamIcon className="w-6 h-6" />
            </div>
            Organization Chart
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            View your company's organizational structure
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'chart'
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Chart View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              List View
            </button>
          </div>
          <Button variant="secondary">
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">{config.terminology.employees}</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.departments}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Departments</p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.levels}</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Org Levels</p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card variant="bordered" padding="md">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, title, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </Card>

      {/* Chart View */}
      {viewMode === 'chart' && !searchQuery && (
        <Card variant="bordered" className="overflow-x-auto">
          <div className="min-w-max p-8 flex justify-center">
            <div className="relative">
              {/* CEO Node */}
              {orgNodes.filter(n => n.level === 0).map(node => (
                <OrgNodeCard key={node.id} node={node} />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* List View or Search Results */}
      {(viewMode === 'list' || searchQuery) && (
        <Card variant="bordered">
          <div className="space-y-2">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => viewProfile(node)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    {node.avatar ? (
                      <img src={node.avatar} alt={node.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      node.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{node.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{node.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs rounded-full ${getDepartmentColor(node.department)}`}>
                    {node.department}
                  </span>
                  {node.reportsTo && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-slate-400">Reports to</p>
                      <p className="text-sm text-gray-700 dark:text-slate-300">
                        {getNodeById(node.reportsTo)?.name || 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredNodes.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-gray-500 dark:text-slate-400">No results found for "{searchQuery}"</p>
            </div>
          )}
        </Card>
      )}

      {/* Department Legend */}
      <Card variant="glass">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Departments</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(orgNodes.map(n => n.department))).map(dept => (
            <span key={dept} className={`px-3 py-1 text-xs rounded-full ${getDepartmentColor(dept)}`}>
              {dept}
            </span>
          ))}
        </div>
      </Card>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Employee Profile"
        size="md"
      >
        {selectedNode && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                {selectedNode.avatar ? (
                  <img src={selectedNode.avatar} alt={selectedNode.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  selectedNode.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedNode.name}</h3>
                <p className="text-gray-500 dark:text-slate-400">{selectedNode.title}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${getDepartmentColor(selectedNode.department)}`}>
                  {selectedNode.department}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedNode.email}</p>
              </div>
              {selectedNode.phone && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedNode.phone}</p>
                </div>
              )}
            </div>

            {/* Reports To */}
            {selectedNode.reportsTo && (
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Reports To</p>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                    {getNodeById(selectedNode.reportsTo)?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getNodeById(selectedNode.reportsTo)?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {getNodeById(selectedNode.reportsTo)?.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Reports */}
            {selectedNode.directReports.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">
                  Direct Reports ({selectedNode.directReports.length})
                </p>
                <div className="space-y-2">
                  {selectedNode.directReports.slice(0, 5).map(reportId => {
                    const report = getNodeById(reportId);
                    if (!report) return null;
                    return (
                      <div key={reportId} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                          {report.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{report.name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{report.title}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
              <Button variant="secondary" className="flex-1">
                Send Email
              </Button>
              <Button className="flex-1">
                View Full Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrgChart;
