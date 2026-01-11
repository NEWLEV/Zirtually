import React from 'react';
import { User, UserRole, View } from '../types';
import { 
    DashboardIcon, OnboardingIcon, GoalsIcon, LearningIcon, TeamIcon, AIIcon, 
    PerformanceReviewIcon, SkillMatrixIcon, DocumentManagementIcon, AuditLogIcon,
    MyJourneyIcon, CredentialingIcon, WellnessIcon, ProfileIcon, NotificationsIcon,
    MicrophoneIcon
} from './ui/icons/Icon';

interface SidebarProps {
  user: User;
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
}> = ({ view, activeView, setActiveView, icon }) => {
  const isActive = activeView === view;
  return (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-brand-primary text-white shadow-lg'
            : 'text-gray-200 hover:bg-brand-dark hover:text-white'
        }`}
      >
        <span className="w-6 h-6 mr-3">{icon}</span>
        <span className="font-medium">{view}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView }) => {
  const personalNav = [
    { view: View.DASHBOARD, icon: <DashboardIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.MY_JOURNEY, icon: <MyJourneyIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.ONBOARDING, icon: <OnboardingIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.GOALS, icon: <GoalsIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.PERFORMANCE_REVIEWS, icon: <PerformanceReviewIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.PROFILE, icon: <ProfileIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.NOTIFICATIONS, icon: <NotificationsIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
  ];
  
  const developmentNav = [
      { view: View.LEARNING, icon: <LearningIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
      { view: View.CREDENTIALING, icon: <CredentialingIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
      { view: View.WELLNESS, icon: <WellnessIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
  ];

  const practiceNav = [
    { view: View.TEAM, icon: <TeamIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.DOCUMENT_MANAGEMENT, icon: <DocumentManagementIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { view: View.SKILL_MATRIX, icon: <SkillMatrixIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { view: View.AI_ASSISTANT, icon: <AIIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.CLINICAL_SCRIBE, icon: <MicrophoneIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.AUDIT_LOG, icon: <AuditLogIcon className="w-6 h-6" />, roles: [UserRole.ADMIN] },
  ];

  const renderNavItems = (items: typeof personalNav) => {
      return items.filter(item => item.roles.includes(user.role)).map(item => (
        <NavItem key={item.view} {...item} activeView={activeView} setActiveView={setActiveView} />
      ));
  }

  return (
    <aside className="w-64 bg-brand-dark text-white flex flex-col p-4">
      <div className="flex items-center mb-10 p-2">
        <svg className="w-10 h-10 text-brand-secondary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        <h1 className="text-xl font-bold tracking-tight">MedStaff Connect</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
            {renderNavItems(personalNav)}
        </ul>
        <hr className="my-4 border-gray-600" />
        <ul className="space-y-2">
            {renderNavItems(developmentNav)}
        </ul>
        <hr className="my-4 border-gray-600" />
        <ul className="space-y-2">
            {renderNavItems(practiceNav)}
        </ul>
      </nav>
      <div className="mt-auto p-4 bg-gray-800 rounded-lg text-center">
        <p className="text-xs text-gray-400">
          This system handles sensitive information. Always adhere to HIPAA guidelines.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;