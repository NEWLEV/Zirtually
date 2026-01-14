import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Industry, IndustryConfig, View } from './types';
import { INDUSTRY_CONFIGS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import CommandPalette from './components/CommandPalette';
import AppRoutes from './components/AppRoutes';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
import { NovaProvider } from './components/Nova/NovaContext';
import { NovaAssistant } from './components/Nova/NovaAssistant';
import { useSettings } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
// Re-exporting IndustryContext for other components to consume
// We define it here to avoid circular dependency issues.
export const IndustryContext = React.createContext<{
  industry: Industry;
  config: IndustryConfig;
  setIndustry: (industry: Industry) => void;
}>({
  industry: 'technology',
  config: INDUSTRY_CONFIGS.technology,
  setIndustry: () => {},
});

export const useIndustry = () => React.useContext(IndustryContext);

const AppContent: React.FC = () => {
  const { currentUser, login, logout, updateUser, users } = useAuth();
  useNotifications(currentUser);
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useSettings();

  const [industry, setIndustry] = useState<Industry>(
    () => (localStorage.getItem('zirtually_industry') as Industry) || 'technology'
  );
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const industryConfig = INDUSTRY_CONFIGS[industry];

  // Derive active view from URL
  const activeView = useMemo(() => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return View.DASHBOARD;
    if (path === '/journey') return View.MY_JOURNEY;
    if (path === '/onboarding') return View.ONBOARDING;
    if (path === '/goals') return View.GOALS;
    if (path === '/reviews') return View.PERFORMANCE_REVIEWS;
    if (path === '/learning') return View.LEARNING;
    if (path === '/credentials') return View.CREDENTIALING;
    if (path === '/wellness') return View.WELLNESS;
    if (path === '/skills') return View.SKILL_MATRIX;
    if (path === '/team') return View.TEAM;
    if (path === '/directory') return View.DIRECTORY;
    if (path === '/org-chart') return View.ORG_CHART;
    if (path === '/time-off') return View.TIME_OFF;
    if (path === '/benefits') return View.BENEFITS;
    if (path === '/surveys') return View.SURVEYS;
    if (path === '/ai') return View.AI_ASSISTANT;
    if (path === '/analytics') return View.ANALYTICS;
    if (path === '/documents') return View.DOCUMENT_MANAGEMENT;
    if (path === '/audit-log') return View.AUDIT_LOG;
    if (path === '/profile') return View.PROFILE;
    if (path === '/notifications') return View.NOTIFICATIONS;
    if (path === '/settings') return View.SETTINGS;
    if (path === '/offboarding') return View.OFFBOARDING;
    if (path === '/admin') return View.ADMIN_CONSOLE;
    return View.DASHBOARD;
  }, [location.pathname]);

  const handleSetActiveView = (view: View) => {
    const routeMap: Record<View, string> = {
      [View.DASHBOARD]: '/dashboard',
      [View.MY_JOURNEY]: '/journey',
      [View.ONBOARDING]: '/onboarding',
      [View.GOALS]: '/goals',
      [View.PERFORMANCE_REVIEWS]: '/reviews',
      [View.LEARNING]: '/learning',
      [View.CREDENTIALING]: '/credentials',
      [View.WELLNESS]: '/wellness',
      [View.SKILL_MATRIX]: '/skills',
      [View.TEAM]: '/team',
      [View.DIRECTORY]: '/directory',
      [View.ORG_CHART]: '/org-chart',
      [View.TIME_OFF]: '/time-off',
      [View.BENEFITS]: '/benefits',
      [View.SURVEYS]: '/surveys',
      [View.AI_ASSISTANT]: '/ai',
      [View.ANALYTICS]: '/analytics',
      [View.DOCUMENT_MANAGEMENT]: '/documents',
      [View.AUDIT_LOG]: '/audit-log',
      [View.PROFILE]: '/profile',
      [View.NOTIFICATIONS]: '/notifications',
      [View.SETTINGS]: '/settings',
      [View.OFFBOARDING]: '/offboarding',
      [View.ADMIN_CONSOLE]: '/admin',
    };
    navigate(routeMap[view] || '/');
  };

  useEffect(() => {
    localStorage.setItem('zirtually_industry', industry);
    document.documentElement.style.setProperty('--color-primary', industryConfig.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', industryConfig.secondaryColor);
  }, [industry, industryConfig]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentUser) {
    return (
      <IndustryContext.Provider value={{ industry, config: industryConfig, setIndustry }}>
        <Login onLogin={login} users={users} />
      </IndustryContext.Provider>
    );
  }

  return (
    <NovaProvider userName={currentUser.name}>
      <IndustryContext.Provider value={{ industry, config: industryConfig, setIndustry }}>
        {/* Skip to Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-action-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-ring"
        >
          Skip to main content
        </a>

        <div className="min-h-screen flex bg-bg-primary dark:bg-dark-bg text-text-primary dark:text-dark-text.transition-colors duration-200">
          <Sidebar
            user={currentUser}
            activeView={activeView}
            setActiveView={handleSetActiveView}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}
          >
            <Header
              user={currentUser}
              onLogout={logout}
              theme={theme}
              setTheme={setTheme}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              setActiveView={handleSetActiveView}
            />
            <main id="main-content" className="flex-1 p-6 lg:p-8 overflow-y-auto" role="main">
              <AppRoutes
                user={currentUser}
                onUserUpdate={updateUser}
                onLogout={logout}
                setActiveView={handleSetActiveView}
              />
            </main>
          </div>

          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelect={handleSetActiveView}
            currentView={activeView}
          />
        </div>
        <NovaAssistant />
      </IndustryContext.Provider>
    </NovaProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
