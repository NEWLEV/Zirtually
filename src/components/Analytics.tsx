import React, { useState } from 'react';
import { User, AnalyticsMetric } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { AnalyticsIcon, ArrowTrendingUpIcon } from './ui/icons/Icon';
import { MOCK_ANALYTICS } from '../constants';
import Breadcrumbs from './ui/Breadcrumbs';
import { View } from '../types';

interface AnalyticsProps {
  user: User;
  setActiveView: (view: View) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ setActiveView }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [metrics] = useState<AnalyticsMetric[]>(MOCK_ANALYTICS);

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'stable':
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'stable':
        return '→';
    }
  };

  // Mock data for charts
  const headcountData = [
    { month: 'Jul', value: 145 },
    { month: 'Aug', value: 152 },
    { month: 'Sep', value: 148 },
    { month: 'Oct', value: 155 },
    { month: 'Nov', value: 162 },
    { month: 'Dec', value: 168 },
  ];

  const turnoverData = [
    { month: 'Jul', voluntary: 2, involuntary: 1 },
    { month: 'Aug', voluntary: 3, involuntary: 0 },
    { month: 'Sep', voluntary: 1, involuntary: 2 },
    { month: 'Oct', voluntary: 2, involuntary: 1 },
    { month: 'Nov', voluntary: 1, involuntary: 0 },
    { month: 'Dec', voluntary: 2, involuntary: 1 },
  ];

  const departmentBreakdown = [
    { name: 'Engineering', count: 45, percentage: 27 },
    { name: 'Sales', count: 32, percentage: 19 },
    { name: 'Marketing', count: 24, percentage: 14 },
    { name: 'Operations', count: 28, percentage: 17 },
    { name: 'HR', count: 12, percentage: 7 },
    { name: 'Finance', count: 15, percentage: 9 },
    { name: 'Other', count: 12, percentage: 7 },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Admin' }, { label: 'Analytics' }]}
        setActiveView={setActiveView}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
              <AnalyticsIcon className="w-6 h-6" />
            </div>
            HR Analytics
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Workforce insights and trends</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['week', 'month', 'quarter', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.slice(0, 4).map(metric => (
          <Card key={metric.id} variant="glass" padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">{metric.name}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {metric.value}
                  {metric.unit === 'percent' ? '%' : ''}
                </p>
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(metric.trend || 'stable')}`}
              >
                {getTrendIcon(metric.trend || 'stable')}
                {Math.abs(metric.changePercent || 0)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
              vs. previous {timeRange}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount Trend */}
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Headcount Trend</h3>
            <span className="text-sm text-green-500 font-medium flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" />
              +15.9%
            </span>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {headcountData.map((item, i) => {
              const maxValue = Math.max(...headcountData.map(d => d.value));
              const height = (item.value / maxValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all hover:from-indigo-500 hover:to-violet-400"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-slate-400">{item.month}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Turnover Analysis */}
        <Card variant="bordered">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Turnover Analysis
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Voluntary
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                Involuntary
              </span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {turnoverData.map((item, i) => {
              const maxValue = 5;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: '160px' }}>
                    <div
                      className="w-full bg-amber-500 rounded-t transition-all"
                      style={{ height: `${(item.voluntary / maxValue) * 100}%` }}
                    />
                    <div
                      className="w-full bg-red-500 rounded-t transition-all"
                      style={{ height: `${(item.involuntary / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{item.month}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Department Breakdown */}
        <Card variant="bordered">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Department Breakdown
          </h3>
          <div className="space-y-4">
            {departmentBreakdown.map(dept => (
              <div key={dept.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {dept.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    {dept.count} ({dept.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Insights */}
        <Card variant="glass">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            AI-Powered Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <span className="text-xl">📈</span>
                <div>
                  <p className="font-medium text-green-900 dark:text-green-200">Strong Growth</p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Headcount increased 15.9% this quarter, exceeding the industry average of 8%.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-200">Attention Needed</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Engineering dept turnover is 2x higher than company average. Consider retention
                    initiatives.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-200">Opportunity</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Employee engagement scores improved 12% after launching the wellness program.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">All Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {metrics.map(metric => (
            <div key={metric.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{metric.name}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                  {metric.unit === 'percent' ? '%' : ''}
                </p>
                <span className={`text-xs font-medium ${getTrendColor(metric.trend || 'stable')}`}>
                  {getTrendIcon(metric.trend || 'stable')} {Math.abs(metric.changePercent || 0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Export Analytics Report</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Generate a comprehensive PDF or Excel report
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Export PDF</Button>
          <Button variant="secondary">Export Excel</Button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
