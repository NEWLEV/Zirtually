import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { User, View, TaskStatus, Industry, IndustryConfig } from './types';
import { 
  MOCK_USERS, createAuditLog, MOCK_ONBOARDING_TASKS, MOCK_TRAINING, 
  INDUSTRY_CONFIGS, MOCK_ORGANIZATION 
} from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import Goals from './components/Goals';
import Learning from './components/Learning';
import Team from './components/Team';
import AIAssistant from './components/AIAssistant';
import PerformanceReviews from './components/PerformanceReviews';
import SkillMatrix from './components/SkillMatrix';
import DocumentManagement from './components/DocumentManagement';
import Login from './components/Login';
import AuditLog from './components/AuditLog';
import MyJourney from './components/MyJourney';
import Credentialing from './components/Credentialing';
import Wellness from './components/Wellness';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import TimeOff from './components/TimeOff';
import Directory from './components/Directory';
import OrgChart from './components/OrgChart';
import Benefits from './components/Benefits';
import Surveys from './components/Surveys';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Offboarding from './components/Offboarding';
import CommandPalette from './components/CommandPalette';

type Theme = 'light' | 'dark';

// Industry Context
interface IndustryContextType {
  industry: Industry;
  config: IndustryConfig;
  setIndustry: (industry: Industry) => void;
}

export const IndustryContext = createContext<IndustryContextType>({
  industry: 'technology',
  config: INDUSTRY_CONFIGS.technology,
  setIndustry: () => {},
});

export const useIndustry = () => useContext(IndustryContext);

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('zirtually_users');
    return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('zirtually_theme') as Theme) || 'light');
  const [industry, setIndustry] = useState<Industry>(() => (localStorage.getItem('zirtually_industry') as Industry) || 'technology');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const industryConfig = INDUSTRY_CONFIGS[industry];

  useEffect(() => {
    localStorage.setItem('zirtually_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('zirtually_industry', industry);
    // Update CSS variables based on industry
    document.documentElement.style.setProperty('--color-primary', industryConfig.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', industryConfig.secondaryColor);
  }, [industry, industryConfig]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('zirtually_theme', theme);
  }, [theme]);

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

  // Notification check effect
  useEffect(() => {
    if (!currentUser) return;

    const checkAndSendNotifications = () => {
      const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
      if (!settings.enabled || !('Notification' in window) || Notification.permission !== 'granted') {
        return;
      }

      const notifiedItems = new Set(JSON.parse(localStorage.getItem('notifiedItems') || '[]'));
      const newNotifiedItems = new Set(notifiedItems);

      MOCK_ONBOARDING_TASKS.forEach(task => {
        if (task.status !== TaskStatus.DONE && !notifiedItems.has(task.id) && task.assignedTo === currentUser.id) {
          const dueDate = new Date(task.dueDate);
          const daysUntilDue = (dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
          if (daysUntilDue > 0 && daysUntilDue <= (settings.taskDays || 3)) {
            new Notification('Task Reminder', {
              body: `Your task "${task.title}" is due in ${Math.ceil(daysUntilDue)} days.`,
              icon: '/favicon.ico',
            });
            newNotifiedItems.add(task.id);
          }
        }
      });

      MOCK_TRAINING.forEach(module => {
        if (!module.completed && module.dueDate && !notifiedItems.has(module.id)) {
          const dueDate = new Date(module.dueDate);
          const daysUntilDue = (dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
          if (daysUntilDue > 0 && daysUntilDue <= (settings.trainingDays || 3)) {
            new Notification('Training Reminder', {
              body: `Training "${module.title}" is due in ${Math.ceil(daysUntilDue)} days.`,
              icon: '/favicon.ico',
            });
            newNotifiedItems.add(module.id);
          }
        }
      });

      localStorage.setItem('notifiedItems', JSON.stringify(Array.from(newNotifiedItems)));
    };

    const intervalId = setInterval(checkAndSendNotifications, 3600 * 1000);
    checkAndSendNotifications();

    return () => clearInterval(intervalId);
  }, [currentUser]);

  const handleLogin = useCallback((user: User) => {
    const userFromState = users.find(u => u.id === user.id) || user;
    setCurrentUser(userFromState);
    setActiveView(View.DASHBOARD);
    createAuditLog(userFromState, 'USER_LOGIN', 'User logged into Zirtually.');
  }, [users]);

  const handleLogout = useCallback(() => {
    if (currentUser) {
      createAuditLog(currentUser, 'USER_LOGOUT', 'User logged out of Zirtually.');
    }
    setCurrentUser(null);
    setActiveView(View.DASHBOARD);
  }, [currentUser]);

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    createAuditLog(updatedUser, 'UPDATE_PROFILE', 'User updated their profile.');
  };

  const handleCommandSelect = (view: View) => {
    setActiveView(view);
    setIsCommandPaletteOpen(false);
  };

  const renderView = () => {
    if (!currentUser) return null;
    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard user={currentUser} setActiveView={setActiveView} />;
      case View.MY_JOURNEY:
        return <MyJourney user={currentUser} />;
      case View.ONBOARDING:
        return <Onboarding user={currentUser} />;
      case View.GOALS:
        return <Goals user={currentUser} />;
      case View.PERFORMANCE_REVIEWS:
        return <PerformanceReviews user={currentUser} />;
      case View.LEARNING:
        return <Learning user={currentUser} />;
      case View.CREDENTIALING:
        return <Credentialing user={currentUser} />;
      case View.WELLNESS:
        return <Wellness user={currentUser} />;
      case View.SKILL_MATRIX:
        return <SkillMatrix user={currentUser} />;
      case View.TEAM:
        return <Team user={currentUser} />;
      case View.DIRECTORY:
        return <Directory user={currentUser} />;
      case View.ORG_CHART:
        return <OrgChart user={currentUser} />;
      case View.TIME_OFF:
        return <TimeOff user={currentUser} />;
      case View.BENEFITS:
        return <Benefits user={currentUser} />;
      case View.SURVEYS:
        return <Surveys user={currentUser} />;
      case View.AI_ASSISTANT:
        return <AIAssistant user={currentUser} />;
      case View.ANALYTICS:
        return <Analytics user={currentUser} />;
      case View.DOCUMENT_MANAGEMENT:
        return <DocumentManagement user={currentUser} />;
      case View.AUDIT_LOG:
        return <AuditLog user={currentUser} />;
      case View.PROFILE:
        return <Profile user={currentUser} onUserUpdate={handleUserUpdate} />;
      case View.NOTIFICATIONS:
        return <Notifications user={currentUser} />;
      case View.SETTINGS:
        return <Settings user={currentUser} onLogout={handleLogout} />;
      case View.OFFBOARDING:
        return <Offboarding user={currentUser} />;
      default:
        return <Dashboard user={currentUser} setActiveView={setActiveView} />;
    }
  };

  if (!currentUser) {
    return (
      <IndustryContext.Provider value={{ industry, config: industryConfig, setIndustry }}>
        <Login onLogin={handleLogin} users={users} />
      </IndustryContext.Provider>
    );
  }

  return (
    <IndustryContext.Provider value={{ industry, config: industryConfig, setIndustry }}>
      <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Sidebar 
          user={currentUser} 
          activeView={activeView} 
          setActiveView={setActiveView}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Header 
            user={currentUser} 
            onLogout={handleLogout} 
            theme={theme} 
            setTheme={setTheme}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {renderView()}
          </main>
        </div>
        
        <CommandPalette 
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelect={handleCommandSelect}
          currentView={activeView}
        />
      </div>
    </IndustryContext.Provider>
  );
};

export default App;
