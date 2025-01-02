import React from 'react';
import { MessageSquare, Users } from 'lucide-react';

interface CommunicationsHeaderProps {
  activeTab: 'messages' | 'agents';
  onTabChange: (tab: 'messages' | 'agents') => void;
}

export default function CommunicationsHeader({ activeTab, onTabChange }: CommunicationsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-text dark:text-dark-text">Communications</h1>
        <div className="flex gap-4">
          <button
            onClick={() => onTabChange('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'messages'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>
          <button
            onClick={() => onTabChange('agents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'agents'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Agents
          </button>
        </div>
      </div>
    </div>
  );
}