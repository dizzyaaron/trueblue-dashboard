import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="col-span-9 bg-surface rounded-xl shadow-sm p-6">
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="input-primary pl-10"
          />
        </div>
        <button className="px-4 py-2 text-text bg-background rounded-lg hover:bg-gray-200 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      <div className="space-y-2">
        {messages.map(message => (
          <div
            key={message.id}
            className={`p-4 rounded-lg hover:bg-background cursor-pointer ${
              message.status === 'unread' ? 'bg-blue-50' : 'bg-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    message.status === 'unread' ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium text-text">{message.from}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.subject}</p>
                <p className="text-sm text-gray-500 mt-1">{message.preview}</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">{message.date}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  message.type === 'email' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {message.type.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;