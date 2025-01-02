import React from 'react';
import { Bell, Search } from 'lucide-react';
import AIStatusIndicator from './AIStatusIndicator';

export default function Header() {
  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4 transition-colors duration-300 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, customers, or invoices..."
              className="input-primary pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <AIStatusIndicator />
          
          <button className="relative p-2 text-text hover:bg-background rounded-full">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-secondary rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}