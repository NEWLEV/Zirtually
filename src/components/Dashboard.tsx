import React, { useMemo } from 'react';
import { User, UserRole } from '../types';
import {
  MOCK_GOALS,
  MOCK_TRAINING,
  MOCK_ANNOUNCEMENTS,
  MANAGER_NUDGES,
  MOCK_USERS,
  MOCK_ANALYTICS,
  MOCK_TIME_OFF_REQUESTS,
} from '../constants';
import { useIndustry } from '../App';
import Card from './ui/Card';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';

interface DashboardProps {
  user: User;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color: string;
}> = ({ title, value, subtitle, trend, trendValue, color }) => {
  const colorClasses = {
    indigo: 'from-action-secondary to-action-secondary/80',
    emerald: 'from-status-success to-status-success/80',
    amber: 'from-status-warning to-status-warning/80',
    violet: 'from-action-primary to-action-primary/80',
    rose: 'from-status-error to-status-error/80',
    cyan: 'from-focus-ring to-focus-ring/80',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-bg-elevated dark:bg-dark-card p-6 shadow-sm border border-border-light dark:border-dark-border transition-colors duration-200">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo} opacity-10 rounded-full -translate-y-8 translate-x-8`}
      />
      <div className="relative">
        <p className="text-sm font-medium text-text-tertiary dark:text-dark-text-secondary">
          {title}
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-3xl font-bold text-text-primary dark:text-dark-text">{value}</p>
          {trend && trendValue && (
            <span
              className={`inline-flex items-center text-sm font-medium ${trend === 'up'
                  ? 'text-status-success'
                  : trend === 'down'
                    ? 'text-status-error'
                    : 'text-text-tertiary'
                }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </span>
          )}
        </div>
        <p className="text-sm text-text-tertiary dark:text-dark-text-secondary mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { config } = useIndustry();

  const userGoals = MOCK_GOALS.filter(
    g => g.owner === user.id || (g.isTeamGoal && user.role !== UserRole.STAFF)
  );
  const pendingTasks = 5; // Mock
  const overdueTraining = MOCK_TRAINING.filter(t => t.type === 'Mandatory' && !t.completed).length;
  const totalPoints = MOCK_TRAINING.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);
  const pendingTimeOff = MOCK_TIME_OFF_REQUESTS.filter(r => r.status === 'pending').length;

  const managerNudges = MANAGER_NUDGES.map(nudge => ({
    ...nudge,
    employee: MOCK_USERS.find(u => u.id === nudge.employeeId),
  }));

  const engagementMetric = MOCK_ANALYTICS.find(m => m.name === 'Employee Satisfaction');
  const retentionMetric = MOCK_ANALYTICS.find(m => m.name === 'Retention Rate');

  const journeyDay = useMemo(() => {
    if (!user.startDate) return 0;
    const start = new Date(user.startDate).getTime();
    const now = new Date().setHours(0, 0, 0, 0); // Using a stable date for comparison
    return Math.ceil((now - start) / (1000 * 60 * 60 * 24));
  }, [user.startDate]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
            Here&apos;s what&apos;s happening with your {config.terminology.workspace.toLowerCase()}{' '}
            today.
          </p>
        </div>
        {user.isNewHire && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-action-primary to-action-secondary rounded-full text-text-inverse text-sm font-medium shadow-lg shadow-action-primary/20">
            <span className="animate-pulse">●</span>
            Day {journeyDay} of your journey
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle="Due this week"
          color="indigo"
        />
        <MetricCard
          title="Training Status"
          value={overdueTraining > 0 ? overdueTraining : '✓'}
          subtitle={overdueTraining > 0 ? 'Modules pending' : 'All complete'}
          color={overdueTraining > 0 ? 'amber' : 'emerald'}
        />
        <MetricCard
          title="Active Goals"
          value={userGoals.length}
          subtitle="In progress"
          color="violet"
        />
        <MetricCard
          title="Learning Points"
          value={totalPoints}
          subtitle="Total earned"
          color="cyan"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Goals & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goals Overview */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Goals Progress
              </h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {userGoals.slice(0, 4).map(goal => (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                        {goal.isTeamGoal && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-action-secondary/10 text-action-secondary border border-action-secondary/20 rounded-full">
                            Team
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-tertiary dark:text-dark-text-secondary mt-1 line-clamp-1">
                        {goal.description}
                      </p>
                    </div>
                    <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                      {goal.progress}%
                    </span>
                  </div>
                  <ProgressBar progress={goal.progress} />
                </div>
              ))}
            </div>
          </Card>

          {/* Analytics Snapshot - Managers Only */}
          {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Team Analytics
                </h3>
                <Button variant="ghost" size="sm">
                  Full Report
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-status-success-bg dark:bg-status-success/10 border border-status-success/20">
                  <p className="text-sm font-bold text-status-success">Team Satisfaction</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-text-primary dark:text-dark-text">
                      {engagementMetric?.value}
                    </span>
                    <span className="text-lg text-text-tertiary">/5</span>
                  </div>
                  <p className="text-xs text-status-success mt-1 font-medium">
                    ↑ from {engagementMetric?.previousValue} last quarter
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-status-info-bg dark:bg-status-info/10 border border-status-info/20">
                  <p className="text-sm font-bold text-status-info">Retention Rate</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-text-primary dark:text-dark-text">
                      {retentionMetric?.value}
                    </span>
                    <span className="text-lg text-text-tertiary">%</span>
                  </div>
                  <p className="text-xs text-status-info mt-1 font-medium">
                    ↑ from {retentionMetric?.previousValue}% last quarter
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Nudges & Announcements */}
        <div className="space-y-6">
          {/* Manager Nudges */}
          {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Nudges</h3>
                <span className="flex items-center gap-1 px-2 py-1 bg-action-primary/10 text-action-primary text-xs font-semibold rounded-full border border-action-primary/20">
                  <span className="w-2 h-2 bg-action-primary rounded-full animate-pulse" />
                  AI Powered
                </span>
              </div>
              <div className="space-y-3">
                {managerNudges.map(
                  nudge =>
                    nudge.employee && (
                      <div
                        key={nudge.id}
                        className="p-3 rounded-xl bg-bg-secondary dark:bg-dark-card border border-border-light dark:border-dark-border"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={nudge.employee.avatarUrl}
                            alt={nudge.employee.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-action-primary/20"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-primary dark:text-dark-text">
                              {nudge.title}
                            </p>
                            <p className="text-xs text-text-tertiary dark:text-dark-text-secondary mt-0.5 line-clamp-2">
                              {nudge.details}
                            </p>
                            <Button variant="ghost" size="sm" className="mt-2 h-7 px-2">
                              {nudge.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </Card>
          )}

          {/* Announcements */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text">
                Announcements
              </h3>
              <span className="text-xs text-text-tertiary dark:text-dark-text-secondary">
                {MOCK_ANNOUNCEMENTS.length} new
              </span>
            </div>
            <div className="space-y-4">
              {MOCK_ANNOUNCEMENTS.slice(0, 3).map(announcement => (
                <div key={announcement.id} className="group">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-1 h-full min-h-[60px] rounded-full ${announcement.priority === 'important'
                          ? 'bg-status-warning'
                          : announcement.priority === 'urgent'
                            ? 'bg-status-error'
                            : 'bg-border-medium'
                        }`}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-text-primary dark:text-dark-text group-hover:text-action-primary transition-colors">
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-text-tertiary dark:text-dark-text-secondary mt-1 line-clamp-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-text-tertiary/50 dark:text-dark-text-secondary/50 mt-2">
                        {announcement.author} • {announcement.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Time Off Preview */}
          {pendingTimeOff > 0 && [UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary dark:text-dark-text">
                  Time Off Requests
                </h3>
                <span className="px-2 py-1 bg-status-warning-bg text-status-warning text-xs font-bold rounded-full border border-status-warning/20">
                  {pendingTimeOff} pending
                </span>
              </div>
              <p className="text-sm text-text-tertiary dark:text-dark-text-secondary mt-2">
                You have pending time off requests to review.
              </p>
              <Button variant="secondary" size="sm" className="mt-4 w-full">
                Review Requests
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
