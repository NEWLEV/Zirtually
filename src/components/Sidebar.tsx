import React from 'react';
import { User, UserRole, View } from '../types';
import { useIndustry } from '../App';
import {
  DashboardIcon,
  OnboardingIcon,
  GoalsIcon,
  LearningIcon,
  TeamIcon,
  AIIcon,
  PerformanceReviewIcon,
  SkillMatrixIcon,
  DocumentManagementIcon,
  AuditLogIcon,
  MyJourneyIcon,
  CredentialingIcon,
  WellnessIcon,
  ProfileIcon,
  NotificationsIcon,
  TimeOffIcon,
  DirectoryIcon,
  OrgChartIcon,
  BenefitsIcon,
  SurveysIcon,
  AnalyticsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  OffboardingIcon,
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

const NavItem: React.FC<NavItemProps> = ({
  view,
  activeView,
  setActiveView,
  icon,
  collapsed,
  badge,
}) => {
  const isActive = activeView === view;

  return (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`relative flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive
            ? 'bg-action-primary text-text-inverse shadow-lg shadow-action-primary/25'
            : 'text-text-secondary dark:text-dark-text-secondary hover:bg-bg-secondary dark:hover:bg-dark-card hover:text-text-primary dark:hover:text-dark-text'
        }`}
        title={collapsed ? view : undefined}
        aria-label={view}
      >
        <span className={`w-5 h-5 flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`}>{icon}</span>
        {!collapsed && (
          <>
            <span className="font-medium text-sm truncate">{view}</span>
            {badge && (
              <span
                className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                  isActive
                    ? 'bg-text-inverse/20 text-text-inverse'
                    : 'bg-action-primary/20 text-action-primary'
                }`}
              >
                {badge}
              </span>
            )}
          </>
        )}
        {collapsed && badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-action-primary text-text-inverse rounded-full flex items-center justify-center">
            {typeof badge === 'number' && badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
}) => {
  const { config } = useIndustry();

  interface NavDefinition {
    view: View;
    icon: React.ReactNode;
    roles: UserRole[];
    badge?: string | number;
  }

  const personalNav: NavDefinition[] = [
    {
      view: View.DASHBOARD,
      icon: <DashboardIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.MY_JOURNEY,
      icon: <MyJourneyIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.PROFILE,
      icon: <ProfileIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
  ];

  const workNav: NavDefinition[] = [
    {
      view: View.ONBOARDING,
      icon: <OnboardingIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
      badge: user.isNewHire ? '!' : undefined,
    },
    {
      view: View.OFFBOARDING,
      icon: <OffboardingIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.GOALS,
      icon: <GoalsIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.PERFORMANCE_REVIEWS,
      icon: <PerformanceReviewIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.TIME_OFF,
      icon: <TimeOffIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.BENEFITS,
      icon: <BenefitsIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
  ];

  const developmentNav: NavDefinition[] = [
    {
      view: View.LEARNING,
      icon: <LearningIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
      badge: 2,
    },
    {
      view: View.SKILL_MATRIX,
      icon: <SkillMatrixIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    ...(config.features.credentialing
      ? [
          {
            view: View.CREDENTIALING,
            icon: <CredentialingIcon className="w-5 h-5" />,
            roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
          },
        ]
      : []),
    {
      view: View.WELLNESS,
      icon: <WellnessIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
  ];

  const teamNav: NavDefinition[] = [
    {
      view: View.TEAM,
      icon: <TeamIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.DIRECTORY,
      icon: <DirectoryIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.ORG_CHART,
      icon: <OrgChartIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.SURVEYS,
      icon: <SurveysIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
  ];

  const adminNav: NavDefinition[] = [
    {
      view: View.ADMIN_CONSOLE,
      icon: <SettingsIcon className="w-5 h-5 text-indigo-500" />,
      roles: [UserRole.ADMIN],
    },
    {
      view: View.DOCUMENT_MANAGEMENT,
      icon: <DocumentManagementIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    {
      view: View.AI_ASSISTANT,
      icon: <AIIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.ANALYTICS,
      icon: <AnalyticsIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
    { view: View.AUDIT_LOG, icon: <AuditLogIcon className="w-5 h-5" />, roles: [UserRole.ADMIN] },
    {
      view: View.NOTIFICATIONS,
      icon: <NotificationsIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
    {
      view: View.SETTINGS,
      icon: <SettingsIcon className="w-5 h-5" />,
      roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.STAFF],
    },
  ];

  const renderNavItems = (items: NavDefinition[], showLabel?: string) => {
    const filteredItems = items.filter(item => item.roles.includes(user.role));
    if (filteredItems.length === 0) return null;

    return (
      <div className="space-y-1">
        {showLabel && !collapsed && (
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {showLabel}
          </p>
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
              badge={item.badge}
            />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-bg-elevated dark:bg-dark-bg border-r border-border-light dark:border-dark-border flex flex-col transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Logo */}
      <div
        className={`flex items-center justify-center border-b border-slate-800 ${collapsed ? 'h-20 px-2' : 'h-28 px-4 py-4'}`}
      >
        <img
          src="/zirtually-logo.png"
          alt="Zirtually"
          className={`object-contain transition-all duration-300 ${collapsed ? 'h-12' : 'h-16 w-full'}`}
        />
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
      <div className="p-4 border-t border-border-light dark:border-dark-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-text-tertiary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text hover:bg-bg-secondary dark:hover:bg-dark-border/30 transition-colors"
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
        <div className="p-4 border-t border-border-light dark:border-dark-border">
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-action-primary/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary dark:text-dark-text truncate">
                {user.name}
              </p>
              <p className="text-xs text-text-tertiary dark:text-dark-text-secondary truncate">
                {user.department || user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
