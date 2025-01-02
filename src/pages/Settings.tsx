import React from 'react';
import APISettings from '../components/settings/APISettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import BusinessSettings from '../components/settings/BusinessSettings';
import LogoSettings from '../components/settings/LogoSettings';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-dark-text">Settings</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <GeneralSettings />
          <LogoSettings />
          <NotificationSettings />
        </div>
        <div className="space-y-6">
          <BusinessSettings />
          <APISettings />
        </div>
      </div>
    </div>
  );
}