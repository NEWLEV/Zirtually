import React from 'react';
import { User, UserRole, View } from '../types';
import { useIndustry } from '../App';
import { 
  DashboardIcon, OnboardingIcon, GoalsIcon, LearningIcon, TeamIcon, AIIcon, 
  PerformanceReviewIcon, SkillMatrixIcon, DocumentManagementIcon, AuditLogIcon,
  MyJourneyIcon, CredentialingIcon, WellnessIcon, ProfileIcon, NotificationsIcon,
  TimeOffIcon, DirectoryIcon, OrgChartIcon, BenefitsIcon, SurveysIcon, AnalyticsIcon,
  ChevronLeftIcon, ChevronRightIcon, ZirtulalyLogo, SettingsIcon, OffboardingIcon
} from './ui/icons/Icon';

interface SidebarProps {
  user: User;
  activeView: View;
  setActiveView: (view: View) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItemProps {
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  collapsed: boolean;
  badge?: number | string;
}

const NavItem: React.FC<NavItemProps> = ({ view, activeView, setActiveView, icon, collapsed, badge }) => {
  const isActive = activeView === view;
  
  return (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`relative flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
        title={collapsed ? view : undefined}
      >
        <span className={`w-5 h-5 flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`}>{icon}</span>
        {!collapsed && (
          <>
            <span className="font-medium text-sm truncate">{view}</span>
            {badge && (
              <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'
              }`}>
                {badge}
              </span>
            )}
          </>
        )}
        {collapsed && badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-indigo-500 text-white rounded-full flex items-center justify-center">
            {typeof badge === 'number' && badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView, collapsed, setCollapsed }) => {
  const { config } = useIndustry();

  const personalNav = [
    { view: View.DASHBOARD, icon: <DashboardIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.MY_JOURNEY, icon: <MyJourneyIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.PROFILE, icon: <ProfileIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
  ];

  const workNav = [
    { view: View.ONBOARDING, icon: <OnboardingIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF], badge: user.isNewHire ? '!' : undefined },
    { view: View.OFFBOARDING, icon: <OffboardingIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.GOALS, icon: <GoalsIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.PERFORMANCE_REVIEWS, icon: <PerformanceReviewIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.TIME_OFF, icon: <TimeOffIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.BENEFITS, icon: <BenefitsIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
  ];

  const developmentNav = [
    { view: View.LEARNING, icon: <LearningIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF], badge: 2 },
    { view: View.SKILL_MATRIX, icon: <SkillMatrixIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    ...(config.features.credentialing ? [{ view: View.CREDENTIALING, icon: <CredentialingIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] }] : []),
    { view: View.WELLNESS, icon: <WellnessIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
  ];

  const teamNav = [
    { view: View.TEAM, icon: <TeamIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.DIRECTORY, icon: <DirectoryIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.ORG_CHART, icon: <OrgChartIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.SURVEYS, icon: <SurveysIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
  ];

  const adminNav = [
    { view: View.DOCUMENT_MANAGEMENT, icon: <DocumentManagementIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { view: View.AI_ASSISTANT, icon: <AIIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.ANALYTICS, icon: <AnalyticsIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { view: View.AUDIT_LOG, icon: <AuditLogIcon className="w-5 h-5" />, roles: [UserRole.ADMIN] },
    { view: View.NOTIFICATIONS, icon: <NotificationsIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
    { view: View.SETTINGS, icon: <SettingsIcon className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF] },
  ];

  const renderNavItems = (items: typeof personalNav, showLabel?: string) => {
    const filteredItems = items.filter(item => item.roles.includes(user.role));
    if (filteredItems.length === 0) return null;
    
    return (
      <div className="space-y-1">
        {showLabel && !collapsed && (
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{showLabel}</p>
        )}
        <ul className="space-y-1">
          {filteredItems.map(item => (
            <NavItem 
              key={item.view} 
              view={item.view}
              activeView={activeView} 
              setActiveView={setActiveView} 
              icon={item.icon}
              collapsed={collapsed}
              badge={(item as any).badge}
            />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-slate-800 ${collapsed ? 'justify-center px-4' : 'px-5'}`}>
        <ZirtulalyLogo className="w-8 h-8 flex-shrink-0" />
        {!collapsed && (
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Zirtually
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-3' : 'px-4'}`}>
        <div className="space-y-6">
          {renderNavItems(personalNav, 'Personal')}
          {renderNavItems(workNav, 'Work')}
          {renderNavItems(developmentNav, 'Growth')}
          {renderNavItems(teamNav, 'Team')}
          {renderNavItems(adminNav, 'Admin')}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="ml-2 text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.department || user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
