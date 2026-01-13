import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Settings from './Settings';
import { BrowserRouter } from 'react-router-dom';
import { User, UserRole } from '../types';
import { SettingsProvider } from '../context/SettingsContext';

// Mock currentIndustry
vi.mock('../App', () => ({
  useIndustry: () => ({
    config: {},
    setIndustry: vi.fn(),
    currentIndustry: 'technology',
  }),
}));

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: UserRole.STAFF,
  department: 'Engineering',
  avatarUrl: '',
  title: 'Engineer',
  startDate: '2022-01-01',
  isNewHire: false,
};

const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Settings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  const renderSettings = () => {
    return render(
      <SettingsProvider>
        <BrowserRouter>
          <Settings user={mockUser} onLogout={mockLogout} />
        </BrowserRouter>
      </SettingsProvider>
    );
  };

  it('navigates to edit profile when Edit Profile is clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByTestId('edit-profile-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/edit-profile');
  });

  it('opens Change Password modal when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByTestId('change-password-button'));
    expect(screen.getByText('Current Password')).toBeInTheDocument();
  });

  it('opens Two-Factor modal when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByTestId('two-factor-button'));
    expect(
      screen.getByText(/Two-factor authentication adds an extra layer of security/i)
    ).toBeInTheDocument();
  });

  it('triggers download when Download Data is clicked', () => {
    renderSettings();
    const consoleSpy = vi.spyOn(console, 'log');
    fireEvent.click(screen.getByTestId('download-data-button'));
    expect(consoleSpy).toHaveBeenCalledWith('Downloading user data...');
    expect(window.alert).toHaveBeenCalledWith('Download started');
  });

  it('opens Active Sessions modal when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByTestId('active-sessions-button'));
    expect(screen.getByText('TODO: List active sessions')).toBeInTheDocument();
  });

  it('navigates to Security Log when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByTestId('security-log-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/security-log');
  });

  it('opens Delete Account modal when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByTestId('delete-account-button'));
    expect(screen.getByText(/Are you sure you want to delete your account/i)).toBeInTheDocument();
  });

  it('calls logout when Sign Out is clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByTestId('sign-out-button'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
