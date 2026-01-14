import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AdminEmployees from './AdminEmployees';
import AdminStructure from './AdminStructure';
import { AdminService } from '../../services/adminService';
import { MOCK_USERS } from '../../constants';

const { MOCK_USERS_LOCAL } = vi.hoisted(() => {
  return {
    MOCK_USERS_LOCAL: [
      {
        id: 'u1',
        name: 'Samuel Carter Jr',
        email: 'samuel@zirtually.com',
        role: 'Admin',
        department: 'Executive',
        avatarUrl: '',
        isNewHire: false,
      },
      {
        id: 'u2',
        name: 'Alex Chen',
        email: 'alex@zirtually.com',
        role: 'Staff',
        department: 'Engineering',
        avatarUrl: '',
        isNewHire: false,
      },
    ],
  };
});

// Mock Services
vi.mock('../../services/adminService', () => ({
  AdminService: {
    getDepartments: vi.fn(),
    getPositions: vi.fn(),
    createDepartment: vi.fn(),
    updateDepartment: vi.fn(),
    deleteDepartment: vi.fn(),
    createPosition: vi.fn(),
    updatePosition: vi.fn(),
    deletePosition: vi.fn(),
  },
}));

vi.mock('../../services/userService', () => ({
  UserService: {
    getAllUsers: vi.fn(),
  },
}));

import { UserService } from '../../services/userService';
(UserService.getAllUsers as any).mockResolvedValue(MOCK_USERS_LOCAL);

const mockUser = MOCK_USERS_LOCAL[0] as any; // Assume Admin

describe('Admin Module', () => {
  describe('AdminEmployees', () => {
    it('renders employee list correctly', async () => {
      render(<AdminEmployees />);

      await waitFor(() => {
        expect(screen.getByText(MOCK_USERS_LOCAL[0].name)).toBeInTheDocument();
      });
    });

    it('opens invite modal on button click', async () => {
      render(<AdminEmployees />);

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByText('Loading employees...')).not.toBeInTheDocument();
      });

      const addButton = screen.getByText('+ Add Employee');
      fireEvent.click(addButton);

      expect(screen.getByText('Add New Employee')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    });
  });

  describe('AdminStructure', () => {
    it('fetches and displays structure data', async () => {
      (AdminService.getDepartments as any).mockResolvedValue([
        { id: '1', name: 'Engineering', description: 'Tech stuff', manager: null },
      ]);
      (AdminService.getPositions as any).mockResolvedValue([]);

      render(<AdminStructure user={mockUser} />);

      await waitFor(() => {
        expect(screen.getByText('Engineering')).toBeInTheDocument();
        expect(screen.getByText('Tech stuff')).toBeInTheDocument();
      });
    });

    it('calls delete service when delete button is clicked', async () => {
      (AdminService.getDepartments as any).mockResolvedValue([
        { id: '1', name: 'Sales', description: 'Selling stuff', manager: null },
      ]);

      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

      render(<AdminStructure user={mockUser} />);

      await waitFor(() => expect(screen.getByText('Sales')).toBeInTheDocument());

      const deleteButtons = screen.getAllByText('Delete');
      // Sales is in the second column (Departments), so let's find the one next to 'Sales'
      fireEvent.click(deleteButtons[0]);

      expect(AdminService.deleteDepartment).toHaveBeenCalledWith('1');
      confirmSpy.mockRestore();
    });
  });
});
