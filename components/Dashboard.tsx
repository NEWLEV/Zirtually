import React from 'react';
import { User, UserRole } from '../types';
import { MOCK_GOALS, MOCK_TRAINING, MOCK_ANNOUNCEMENTS, MANAGER_NUDGES, MOCK_USERS } from '../constants';
import Card from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Button from './ui/Button';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const openTasks = 2; // Mock data
  const overdueTraining = MOCK_TRAINING.filter(t => t.type === 'Mandatory' && !t.completed).length;
  const totalPoints = MOCK_TRAINING.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);

  const userGoals = MOCK_GOALS.filter(g => g.owner === user.id || (g.isTeamGoal && user.role === 'Manager'));
  const chartData = userGoals.map(g => ({ name: g.title.substring(0, 15) + '...', progress: g.progress }));

  const managerNudges = MANAGER_NUDGES.map(nudge => ({
      ...nudge,
      employee: MOCK_USERS.find(u => u.id === nudge.employeeId)
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <h4 className="text-lg font-semibold text-brand-dark dark:text-blue-100">My Open Tasks</h4>
            <p className="text-4xl font-bold text-brand-primary dark:text-blue-300 mt-2">{openTasks}</p>
            <p className="text-sm text-gray-500 dark:text-blue-300 mt-1">Due this week</p>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800">
            <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-100">Overdue Training</h4>
            <p className={`text-4xl font-bold mt-2 ${overdueTraining > 0 ? 'text-status-warning dark:text-yellow-300' : 'text-status-success dark:text-green-300'}`}>{overdueTraining}</p>
            <p className="text-sm text-gray-500 dark:text-yellow-300 mt-1">Mandatory modules remaining</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <h4 className="text-lg font-semibold text-green-800 dark:text-green-100">Goals Progress</h4>
            <p className="text-4xl font-bold text-brand-secondary dark:text-green-300 mt-2">{userGoals.length}</p>
            <p className="text-sm text-gray-500 dark:text-green-300 mt-1">Active personal & team goals</p>
        </Card>
         <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-100">Learning Points</h4>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-300 mt-2">{totalPoints}</p>
            <p className="text-sm text-gray-500 dark:text-purple-300 mt-1">Total points earned</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className={`space-y-6 ${[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
            <Card className="h-full" title="Goal Progress Overview">
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false}/>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'currentColor' }} className="dark:text-dark-text-secondary" />
                            <YAxis unit="%" tick={{ fontSize: 12, fill: 'currentColor' }} className="dark:text-dark-text-secondary" />
                            <Tooltip cursor={{fill: 'rgba(230, 244, 241, 0.5)'}} contentStyle={{ backgroundColor: 'var(--card-bg, #fff)', border: '1px solid #ddd', borderRadius: '5px' }} />
                            <Bar dataKey="progress" fill="#009F8C" barSize={30} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {[UserRole.MANAGER, UserRole.ADMIN].includes(user.role) && (
             <Card title="AI-Powered Nudges">
                <ul className="space-y-4">
                  {managerNudges.map(nudge => (
                    nudge.employee && (
                      <li key={nudge.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <img src={nudge.employee.avatarUrl} alt={nudge.employee.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-dark-text">{nudge.title}</p>
                                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{nudge.details}</p>
                                <Button variant="secondary" className="mt-2 text-xs py-1 px-2">{nudge.action}</Button>
                            </div>
                        </div>
                      </li>
                    )
                  ))}
                </ul>
             </Card>
          )}
          <Card title="Recent Announcements">
              <ul className="space-y-4">
                  {MOCK_ANNOUNCEMENTS.slice(0, 3).map(ann => (
                      <li key={ann.id} className="border-l-4 border-brand-secondary pl-4">
                          <p className="font-semibold text-gray-800 dark:text-dark-text">{ann.title}</p>
                          <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{ann.content.substring(0, 70)}...</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{ann.author} - {ann.date}</p>
                      </li>
                  ))}
              </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;