import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Zirtually Inc.',
    fiscalYearStart: '01-01',
    timezone: 'America/New_York',
    allowPublicSignups: false,
    requireTwoFactor: true,
  });

  const handleSave = () => {
    // Save to DB or localStorage
    localStorage.setItem('org_settings', JSON.stringify(settings));
    alert('Organization settings saved.');
  };

  return (
    <div className="space-y-6">
      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Organization Defaults
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-600"
              value={settings.companyName}
              onChange={e => setSettings({ ...settings, companyName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fiscal Year Start</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-600"
              value={`2024-${settings.fiscalYearStart}`} // simplified
              onChange={e =>
                setSettings({ ...settings, fiscalYearStart: e.target.value.substring(5) })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Default Timezone</label>
            <select
              className="w-full px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-600"
              value={settings.timezone}
              onChange={e => setSettings({ ...settings, timezone: e.target.value })}
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">GMT</option>
            </select>
          </div>
        </div>
      </Card>

      <Card variant="bordered">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Security & Access
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 border rounded-xl dark:border-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowPublicSignups}
              onChange={e => setSettings({ ...settings, allowPublicSignups: e.target.checked })}
              className="w-5 h-5 rounded text-indigo-600"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Allow Public Signups</p>
              <p className="text-xs text-gray-500">
                If unchecked, only admins can invite new users.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-xl dark:border-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireTwoFactor}
              onChange={e => setSettings({ ...settings, requireTwoFactor: e.target.checked })}
              className="w-5 h-5 rounded text-indigo-600"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Require 2FA</p>
              <p className="text-xs text-gray-500">
                Force all staff to enable Two-Factor Authentication.
              </p>
            </div>
          </label>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
