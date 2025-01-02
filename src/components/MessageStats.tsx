import React from 'react';
import { Inbox, Send, Archive, Trash2 } from 'lucide-react';

const MessageStats: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-primary" />
          <span className="font-medium">Unread</span>
        </div>
        <p className="text-2xl font-bold mt-2">8</p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-green-600" />
          <span className="font-medium">Sent Today</span>
        </div>
        <p className="text-2xl font-bold mt-2">12</p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Archive className="w-5 h-5 text-yellow-600" />
          <span className="font-medium">Templates</span>
        </div>
        <p className="text-2xl font-bold mt-2">6</p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          <span className="font-medium">Archived</span>
        </div>
        <p className="text-2xl font-bold mt-2">24</p>
      </div>
    </div>
  );
};

export default MessageStats;