import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Wellness from './Wellness';
import { BrowserRouter } from 'react-router-dom';
import { User, UserRole } from '../types';
import { SettingsProvider } from '../context/SettingsContext';

// Mock currentIndustry
vi.mock('../App', () => ({
  useIndustry: () => ({
    config: {},
    setIndustry: vi.fn(),
    currentIndustry: 'healthcare',
  }),
}));

// Mock constants if needed, but we can rely on the default values in state init if MOCK_WELLNESS_RESOURCES is imported

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: UserRole.STAFF,
  department: 'Nursing',
  avatarUrl: '',
  title: 'Nurse',
  startDate: '2022-01-01',
  isNewHire: false,
};

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Wellness Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  const renderWellness = () => {
    return render(
      <SettingsProvider>
        <BrowserRouter>
          <Wellness user={mockUser} setActiveView={vi.fn()} />
        </BrowserRouter>
      </SettingsProvider>
    );
  };

  it('opens chat modal when Talk to Someone is clicked', () => {
    renderWellness();
    fireEvent.click(screen.getByTestId('talk-to-someone-button'));
    expect(screen.getByText(/I'm your wellness assistant/i)).toBeInTheDocument();
  });

  it('navigates to EAP services', () => {
    renderWellness();
    fireEvent.click(screen.getByTestId('eap-services-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/wellness/eap');
  });

  it('navigates to resource page when Learn More is clicked', () => {
    renderWellness();
    // Assuming at least one resource is rendered. The mock data should provide some.
    // We'll query for any button with testid starting with learn-more-
    const buttons = screen.getAllByTestId(/^learn-more-/);
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      // Expect calls to navigate
      expect(mockNavigate).toHaveBeenCalled();
    }
  });

  it('alerts when Access is clicked', () => {
    renderWellness();
    const buttons = screen.getAllByTestId(/^access-/);
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      expect(window.alert).toHaveBeenCalledWith('Accessing resource...');
    }
  });

  it('opens support modal when Get Support is clicked', () => {
    renderWellness();
    fireEvent.click(screen.getByTestId('get-support-button'));
    expect(screen.getByText('Choose a support option:')).toBeInTheDocument();
  });

  it('navigates to fitness programs', () => {
    renderWellness();
    fireEvent.click(screen.getByTestId('view-programs-button'));
    expect(mockNavigate).toHaveBeenCalledWith('/wellness/fitness-programs');
  });

  it('sets window location for EAP call', () => {
    renderWellness();
    fireEvent.click(screen.getByTestId('call-eap-button'));
    expect(window.location.href).toBe('tel:18001234567');
  });
});
