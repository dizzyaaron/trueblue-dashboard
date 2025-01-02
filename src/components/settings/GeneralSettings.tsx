import React from 'react';
import DarkModeToggle from '../ui/DarkModeToggle';

export default function GeneralSettings() {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-dark-text">General Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium dark:text-dark-text">Dark Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Toggle between light and dark theme
            </p>
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
}