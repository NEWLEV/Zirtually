import React, { useState, useCallback, useEffect } from 'react';
import { User, View, TaskStatus } from './types';
import { MOCK_USERS, createAuditLog, MOCK_ONBOARDING_TASKS, MOCK_TRAINING } from './constants';
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
import ClinicalScribe from './components/ClinicalScribe';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('mockUsers');
    return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  useEffect(() => {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
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
                    new Notification('Onboarding Task Reminder', {
                        body: `Your task "${task.title}" is due in ${Math.ceil(daysUntilDue)} days.`,
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
                        body: `Mandatory training "${module.title}" is due in ${Math.ceil(daysUntilDue)} days.`,
                    });
                    newNotifiedItems.add(module.id);
                }
            }
        });
        
        localStorage.setItem('notifiedItems', JSON.stringify(Array.from(newNotifiedItems)));
    };

    const intervalId = setInterval(checkAndSendNotifications, 3600 * 1000); // Check every hour
    checkAndSendNotifications(); // Initial check

    return () => clearInterval(intervalId);
  }, [currentUser]);


  const handleLogin = useCallback((user: User) => {
    const userFromState = users.find(u => u.id === user.id) || user;
    setCurrentUser(userFromState);
    setActiveView(View.DASHBOARD);
    createAuditLog(userFromState, 'USER_LOGIN', 'User logged into the system.');
  }, [users]);

  const handleLogout = useCallback(() => {
    if(currentUser) {
      createAuditLog(currentUser, 'USER_LOGOUT', 'User logged out of the system.');
    }
    setCurrentUser(null);
    setActiveView(View.DASHBOARD);
  }, [currentUser]);

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    createAuditLog(updatedUser, 'UPDATE_USER_PROFILE', 'User updated their profile information.');
  };

  const renderView = () => {
    if (!currentUser) return null; // Should not be reachable
    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard user={currentUser} />;
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
      case View.AI_ASSISTANT:
        return <AIAssistant user={currentUser} />;
      case View.CLINICAL_SCRIBE:
        return <ClinicalScribe user={currentUser} />;
      case View.DOCUMENT_MANAGEMENT:
        return <DocumentManagement user={currentUser} />;
      case View.AUDIT_LOG:
        return <AuditLog user={currentUser} />;
      case View.PROFILE:
        return <Profile user={currentUser} onUserUpdate={handleUserUpdate} />;
      case View.NOTIFICATIONS:
        return <Notifications />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen flex text-gray-800 dark:text-dark-text">
      <Sidebar user={currentUser} activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col">
        <Header user={currentUser} onLogout={handleLogout} theme={theme} setTheme={setTheme} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;