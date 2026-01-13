import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import { UserRole } from '../types';
import { IndustryContext } from '../App';
import { INDUSTRY_CONFIGS } from '../constants';

// Mock Industry Context
const mockIndustryValue = {
  industry: 'technology' as const,
  config: INDUSTRY_CONFIGS.technology,
  setIndustry: vi.fn(),
};

const mockUser = {
  id: 'u-1',
  name: 'Samuel Carter',
  role: UserRole.ADMIN,
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  department: 'Engineering',
  email: 'samuel@zirtually.com',
  isNewHire: false,
};

describe('Dashboard Component', () => {
  it('renders welcome message for the user', () => {
    render(
      <IndustryContext.Provider value={mockIndustryValue}>
        <Dashboard user={mockUser} />
      </IndustryContext.Provider>
    );

    expect(screen.getByText(/Welcome back, Samuel/i)).toBeInTheDocument();
  });

  it('renders core metric cards', () => {
    render(
      <IndustryContext.Provider value={mockIndustryValue}>
        <Dashboard user={mockUser} />
      </IndustryContext.Provider>
    );

    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('Active Goals')).toBeInTheDocument();
    expect(screen.getByText('Learning Points')).toBeInTheDocument();
  });

  it('renders Goals Progress section', () => {
    render(
      <IndustryContext.Provider value={mockIndustryValue}>
        <Dashboard user={mockUser} />
      </IndustryContext.Provider>
    );

    expect(screen.getByText('Goals Progress')).toBeInTheDocument();
  });

  it('renders manager-only sections for ADMIN role', () => {
    render(
      <IndustryContext.Provider value={mockIndustryValue}>
        <Dashboard user={mockUser} />
      </IndustryContext.Provider>
    );

    expect(screen.getByText('Team Analytics')).toBeInTheDocument();
    expect(screen.getByText('AI Nudges')).toBeInTheDocument();
  });

  it('hides manager-only sections for STAFF role', () => {
    const staffUser = { ...mockUser, role: UserRole.STAFF };

    render(
      <IndustryContext.Provider value={mockIndustryValue}>
        <Dashboard user={staffUser} />
      </IndustryContext.Provider>
    );

    expect(screen.queryByText('Team Analytics')).not.toBeInTheDocument();
    expect(screen.queryByText('AI Nudges')).not.toBeInTheDocument();
  });
});
