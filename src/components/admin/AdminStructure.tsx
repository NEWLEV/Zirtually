import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import {
  AdminService,
  Department,
  Position,
  PositionWithDept,
  DepartmentWithManager,
} from '../../services/adminService';
import { useAuditLogs } from '../../context/AuditLogContext';
import { User } from '../../types';

interface AdminStructureProps {
  user: User;
}

const AdminStructure: React.FC<AdminStructureProps> = ({ user }) => {
  const { logAction } = useAuditLogs();
  // --- Data State ---
  const [positions, setPositions] = useState<PositionWithDept[]>([]);
  const [departments, setDepartments] = useState<DepartmentWithManager[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Modal Visibility State ---
  const [isDeptModalOpen, setDeptModalOpen] = useState(false);
  const [isPosModalOpen, setPosModalOpen] = useState(false);

  // --- Editing State ---
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingPos, setEditingPos] = useState<Position | null>(null);

  // --- Form Data State ---
  const [deptForm, setDeptForm] = useState({ name: '', description: '' });
  const [posForm, setPosForm] = useState({ title: '', department_id: '', level: 'Junior' });

  // --- Initial Load ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [depts, pos] = await Promise.all([
        AdminService.getDepartments(),
        AdminService.getPositions(),
      ]);
      setDepartments(depts || []);
      setPositions(pos || []);
    } catch (error) {
      console.error('Error fetching structure:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Department Handlers ---

  const openDeptModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({ name: dept.name, description: dept.description || '' });
    } else {
      setEditingDept(null);
      setDeptForm({ name: '', description: '' });
    }
    setDeptModalOpen(true);
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await AdminService.updateDepartment(editingDept.id, deptForm);
        logAction(user, 'UPDATE_DEPARTMENT', 'system', `Updated department: ${deptForm.name}`);
      } else {
        await AdminService.createDepartment(deptForm);
        logAction(user, 'CREATE_DEPARTMENT', 'system', `Created department: ${deptForm.name}`);
      }
      setDeptModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to save department. Name must be unique.');
    }
  };

  const handleDeleteDept = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await AdminService.deleteDepartment(id);
      logAction(user, 'DELETE_DEPARTMENT', 'system', `Deleted department: ${name}`);
      fetchData();
    } catch (error) {
      alert('Cannot delete department. Please remove assigned positions first.');
    }
  };

  // --- Position Handlers ---

  const openPosModal = (pos?: Position) => {
    if (pos) {
      setEditingPos(pos);
      setPosForm({
        title: pos.title,
        department_id: pos.department_id || '',
        level: pos.level || 'Junior',
      });
    } else {
      setEditingPos(null);
      setPosForm({ title: '', department_id: '', level: 'Junior' });
    }
    setPosModalOpen(true);
  };

  const handleSavePos = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPos) {
        await AdminService.updatePosition(editingPos.id, posForm);
        logAction(user, 'UPDATE_POSITION', 'system', `Updated position: ${posForm.title}`);
      } else {
        await AdminService.createPosition(posForm);
        logAction(user, 'CREATE_POSITION', 'system', `Created position: ${posForm.title}`);
      }
      setPosModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to save position.');
    }
  };

  const handleDeletePos = async (id: string, title: string) => {
    if (!window.confirm(`Delete ${title}? This cannot be undone.`)) return;
    try {
      await AdminService.deletePosition(id);
      logAction(user, 'DELETE_POSITION', 'system', `Deleted position: ${title}`);
      fetchData();
    } catch (error) {
      alert('Delete failed.');
    }
  };

  if (loading)
    return (
      <div className="p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-primary"></div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* --- Positions Column --- */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">
            Job Positions
          </h3>
          <Button size="sm" onClick={() => openPosModal()}>
            + Add Position
          </Button>
        </div>
        <Card variant="bordered" padding="none">
          <div className="divide-y divide-border-light dark:divide-dark-border max-h-[500px] overflow-y-auto">
            {positions.length === 0 && (
              <div className="p-4 text-text-tertiary">No positions found.</div>
            )}
            {positions.map(pos => {
              // Helper to safely get dept name (handling joins)
              const deptName = pos.department?.name || 'No Dept';

              return (
                <div
                  key={pos.id}
                  className="p-4 flex justify-between items-center hover:bg-bg-secondary dark:hover:bg-dark-border/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-text-primary dark:text-dark-text">{pos.title}</p>
                    <p className="text-xs text-text-tertiary dark:text-dark-text-secondary">
                      {deptName} • {pos.level}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openPosModal(pos)}
                      className="text-sm font-medium text-link-default hover:text-link-hover dark:text-action-secondary dark:hover:text-action-secondary-hover"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePos(pos.id, pos.title)}
                      className="text-sm font-medium text-status-error hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* --- Departments Column --- */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">
            Departments
          </h3>
          <Button size="sm" onClick={() => openDeptModal()}>
            + Add Department
          </Button>
        </div>
        <Card variant="bordered" padding="none">
          <div className="divide-y divide-border-light dark:divide-dark-border max-h-[500px] overflow-y-auto">
            {departments.length === 0 && (
              <div className="p-4 text-text-tertiary">No departments found.</div>
            )}
            {departments.map(dept => (
              <div
                key={dept.id}
                className="p-4 flex justify-between items-center hover:bg-bg-secondary dark:hover:bg-dark-border/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-text-primary dark:text-dark-text">{dept.name}</p>
                  <p className="text-xs text-text-tertiary dark:text-dark-text-secondary truncate max-w-[200px]">
                    {dept.description || 'No description'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openDeptModal(dept)}
                    className="text-sm font-medium text-link-default hover:text-link-hover dark:text-action-secondary dark:hover:text-action-secondary-hover"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDept(dept.id, dept.name)}
                    className="text-sm font-medium text-status-error hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* --- Modals --- */}

      {/* Department Modal */}
      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setDeptModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Add Department'}
      >
        <form onSubmit={handleSaveDept} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary dark:text-dark-text-secondary">
              Name
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-border-medium dark:border-dark-border rounded-xl bg-bg-elevated dark:bg-dark-card text-text-primary dark:text-dark-text focus:ring-2 focus:ring-focus-ring outline-none transition-shadow"
              value={deptForm.name}
              onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
              placeholder="e.g. Engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary dark:text-dark-text-secondary">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-border-medium dark:border-dark-border rounded-xl bg-bg-elevated dark:bg-dark-card text-text-primary dark:text-dark-text focus:ring-2 focus:ring-focus-ring outline-none transition-shadow"
              value={deptForm.description}
              onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
              placeholder="What does this department do?"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setDeptModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingDept ? 'Save Changes' : 'Create Department'}</Button>
          </div>
        </form>
      </Modal>

      {/* Position Modal */}
      <Modal
        isOpen={isPosModalOpen}
        onClose={() => setPosModalOpen(false)}
        title={editingPos ? 'Edit Position' : 'Add Position'}
      >
        <form onSubmit={handleSavePos} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary dark:text-dark-text-secondary">
              Job Title
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-border-medium dark:border-dark-border rounded-xl bg-bg-elevated dark:bg-dark-card text-text-primary dark:text-dark-text focus:ring-2 focus:ring-focus-ring outline-none"
              value={posForm.title}
              onChange={e => setPosForm({ ...posForm, title: e.target.value })}
              placeholder="e.g. Senior Product Designer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary dark:text-dark-text-secondary">
                Department
              </label>
              <select
                className="w-full px-4 py-2 border border-border-medium dark:border-dark-border rounded-xl bg-bg-elevated dark:bg-dark-card text-text-primary dark:text-dark-text focus:ring-2 focus:ring-focus-ring outline-none"
                value={posForm.department_id}
                onChange={e => setPosForm({ ...posForm, department_id: e.target.value })}
              >
                <option value="">Select...</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-secondary dark:text-dark-text-secondary">
                Level
              </label>
              <select
                className="w-full px-4 py-2 border border-border-medium dark:border-dark-border rounded-xl bg-bg-elevated dark:bg-dark-card text-text-primary dark:text-dark-text focus:ring-2 focus:ring-focus-ring outline-none"
                value={posForm.level}
                onChange={e => setPosForm({ ...posForm, level: e.target.value })}
              >
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setPosModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingPos ? 'Save Changes' : 'Create Position'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStructure;
