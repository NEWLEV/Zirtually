import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from './Profile';
import { User, UserRole } from '../types';
import { SettingsProvider } from '../context/SettingsContext';

// Mock currentIndustry
vi.mock('../App', () => ({
  useIndustry: () => ({
    config: {},
  }),
}));

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: UserRole.STAFF,
  department: 'Engineering',
  avatarUrl: 'http://example.com/avatar.jpg',
  title: 'Engineer',
  startDate: '2022-01-01',
  isNewHire: false,
  managerId: '2',
};

const mockOnUserUpdate = vi.fn();

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProfile = () => {
    return render(
      <SettingsProvider>
        <Profile user={mockUser} onUserUpdate={mockOnUserUpdate} setActiveView={vi.fn()} />
      </SettingsProvider>
    );
  };

  it('toggles edit mode when Edit Profile is clicked', () => {
    renderProfile();
    const editButton = screen.getByText('Edit Profile');
    fireEvent.click(editButton);
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('opens avatar modal in edit mode', () => {
    renderProfile();
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Profile'));
    // Avatar button should be visible
    const avatarButton = screen.getByTestId('avatar-camera-button');
    fireEvent.click(avatarButton);
    expect(screen.getByText('Update Profile Picture')).toBeInTheDocument();
  });

  it('opens add skill modal', () => {
    renderProfile();
    // Navigate to Skills tab
    fireEvent.click(screen.getByText('Skills'));
    fireEvent.click(screen.getByTestId('add-skill-button'));
    expect(screen.getByText('Add New Skill')).toBeInTheDocument();
  });

  it('opens add credential modal', () => {
    renderProfile();
    // Navigate to Credentials tab
    fireEvent.click(screen.getByText('Credentials'));
    fireEvent.click(screen.getByTestId('add-credential-button'));
    expect(screen.getByRole('heading', { name: 'Add Credential' })).toBeInTheDocument();
  });

  it('toggles notification settings', () => {
    renderProfile();
    // Navigate to Settings tab
    fireEvent.click(screen.getByText('Settings'));
    // Check initial state (first one is enabled)
    const toggle0 = screen.getByTestId('notification-toggle-0');
    // Initially enabled class check (bg-action-primary)
    expect(toggle0).toHaveClass('bg-action-primary');
    fireEvent.click(toggle0);
    // Should toggle
    expect(toggle0).toHaveClass('bg-gray-300'); // or dark equivalent
  });
});
