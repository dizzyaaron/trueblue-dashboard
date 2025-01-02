import React, { useState } from 'react';
import { Bell, Mail, MessageSquare } from 'lucide-react';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    jobUpdates: true,
    customerMessages: true,
    systemAlerts: false
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-dark-text">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3 dark:text-dark-text">Notification Channels</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="dark:text-dark-text">Email Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleToggle('email')}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <span className="dark:text-dark-text">SMS Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleToggle('sms')}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="dark:text-dark-text">Push Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={() => handleToggle('push')}
                className="toggle"
              />
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3 dark:text-dark-text">Notification Types</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="dark:text-dark-text">Job Updates</span>
              <input
                type="checkbox"
                checked={notifications.jobUpdates}
                onChange={() => handleToggle('jobUpdates')}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="dark:text-dark-text">Customer Messages</span>
              <input
                type="checkbox"
                checked={notifications.customerMessages}
                onChange={() => handleToggle('customerMessages')}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="dark:text-dark-text">System Alerts</span>
              <input
                type="checkbox"
                checked={notifications.systemAlerts}
                onChange={() => handleToggle('systemAlerts')}
                className="toggle"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}