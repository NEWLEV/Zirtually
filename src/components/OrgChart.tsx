import React, { useState, useMemo } from 'react';
import { User, View } from '../types';
import { useAuthContext } from '../context/AuthContext';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import { TeamIcon, SearchIcon } from './ui/icons/Icon';

interface OrgChartProps {
  user: User;
  setActiveView?: (view: View) => void;
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

// Transform team members into org hierarchy dynamically
const buildOrgHierarchy = (members: User[]): OrgNode[] => {
  const nodes: OrgNode[] = members.map(m => ({
    id: m.id,
    name: m.name,
    title: m.title || 'Team Member',
    avatar: m.avatarUrl,
    department: m.department || 'Staff',
    email: m.email,
    phone: m.phone,
    reportsTo: m.managerId,
    directReports: [],
    level: 0,
  }));

  // Build direct reports
  nodes.forEach(node => {
    if (node.reportsTo) {
      const parent = nodes.find(n => n.id === node.reportsTo);
      if (parent) {
        parent.directReports.push(node.id);
      }
    }
  });

  // Calculate levels recursively (simple approach)
  const calculateLevel = (nodeId: string, visited = new Set<string>()): number => {
    if (visited.has(nodeId)) return 0; // Sanity check for cycles
    visited.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.reportsTo) return 0;
    return 1 + calculateLevel(node.reportsTo, visited);
  };

  nodes.forEach(node => {
    node.level = calculateLevel(node.id);
  });

  return nodes;
};

const OrgChart: React.FC<OrgChartProps> = () => {
  const { users } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  const orgNodes = useMemo(() => buildOrgHierarchy(users), [users]);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const CEOs = orgNodes.filter(n => n.level === 0).map(n => n.id);
    return new Set(CEOs);
  });

  const filteredNodes = searchQuery
    ? orgNodes.filter(
        node =>
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
    levels: orgNodes.length > 0 ? Math.max(...orgNodes.map(n => n.level)) + 1 : 0,
  };

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      Executive:
        'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
      Engineering:
        'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      Product:
        'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      Design: 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300',
      People:
        'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
      HR: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
    };
    return (
      colors[dept] ||
      'border-gray-200 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
    );
  };

  const OrgNodeCard: React.FC<{ node: OrgNode; showChildren?: boolean }> = ({
    node,
    showChildren = true,
  }) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div className="flex flex-col items-center">
        <div
          className={`relative p-4 bg-white dark:bg-slate-800 rounded-xl border-2 ${getDepartmentColor(node.department)} shadow-sm hover:shadow-md transition-all cursor-pointer min-w-48`}
          onClick={() => viewProfile(node)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold mb-2 shadow-sm overflow-hidden border-2 border-white dark:border-slate-700">
              {node.avatar ? (
                <img src={node.avatar} alt={node.name} className="w-full h-full object-cover" />
              ) : (
                node.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{node.name}</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{node.title}</p>
          </div>

          {hasChildren && showChildren && (
            <button
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors border-2 border-white dark:border-slate-800"
              onClick={e => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>

        {showChildren && hasChildren && isExpanded && (
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-6 bg-gray-300 dark:bg-slate-600" />
            <div className="flex gap-6 pt-2">
              {children.map(child => (
                <div key={child.id} className="flex flex-col items-center">
                  <OrgNodeCard node={child} showChildren={true} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl text-white">
              <TeamIcon className="w-6 h-6" />
            </div>
            Organization Chart
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Browse the company hierarchy and direct reporting lines
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'chart'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              List
            </button>
          </div>
          <Button variant="secondary">Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalEmployees}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Total Staff
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.departments}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Departments
            </p>
          </div>
        </Card>
        <Card variant="glass" padding="md">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.levels}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Hierarchy Depth
            </p>
          </div>
        </Card>
      </div>

      <Card variant="bordered" padding="md">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, title, or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-gray-200 dark:border-slate-700"
          />
        </div>
      </Card>

      {viewMode === 'chart' && !searchQuery ? (
        <Card
          variant="bordered"
          className="overflow-x-auto min-h-[500px] bg-slate-50/50 dark:bg-slate-900/50"
        >
          <div className="p-12 flex justify-center">
            <div className="flex gap-12">
              {orgNodes
                .filter(n => n.level === 0)
                .map(node => (
                  <OrgNodeCard key={node.id} node={node} />
                ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card variant="bordered" padding="none">
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => viewProfile(node)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-slate-300 font-bold overflow-hidden">
                    {node.avatar ? (
                      <img src={node.avatar} alt="" />
                    ) : (
                      node.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{node.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{node.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${getDepartmentColor(node.department)}`}
                  >
                    {node.department}
                  </span>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Manager</p>
                    <p className="text-xs text-gray-700 dark:text-slate-300 font-medium whitespace-nowrap">
                      {getNodeById(node.reportsTo || '')?.name || 'Top Level'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredNodes.length === 0 && (
            <div className="text-center py-20">
              <span className="text-4xl mb-4 block opacity-20">🔍</span>
              <p className="text-gray-500 dark:text-slate-400">
                No team members match your search criteria
              </p>
            </div>
          )}
        </Card>
      )}

      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Employee Details"
        size="md"
      >
        {selectedNode && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-3xl font-bold shadow-inner overflow-hidden mb-4 border-4 border-white dark:border-slate-800">
                {selectedNode.avatar ? (
                  <img src={selectedNode.avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                  selectedNode.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedNode.name}
              </h3>
              <p className="text-gray-500 dark:text-slate-400 font-medium">{selectedNode.title}</p>
              <span
                className={`mt-2 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getDepartmentColor(selectedNode.department)}`}
              >
                {selectedNode.department}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">Email Address</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {selectedNode.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">Level in Hierarchy</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  Level {selectedNode.level + 1}
                </span>
              </div>
            </div>

            {selectedNode.reportsTo && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
                  Reporting Line
                </p>
                <div className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                    {getNodeById(selectedNode.reportsTo)
                      ?.name.split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {getNodeById(selectedNode.reportsTo)?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {getNodeById(selectedNode.reportsTo)?.title}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedNode(getNodeById(selectedNode.reportsTo!) || null)}
                  >
                    View
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <Button variant="secondary" className="flex-1">
                Send Message
              </Button>
              <Button className="flex-1">Full Profile</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrgChart;
