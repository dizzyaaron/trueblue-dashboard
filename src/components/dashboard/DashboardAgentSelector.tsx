import React from 'react';
import { Bot } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const agents: Agent[] = [
  { 
    id: 'marketing', 
    name: 'Marketing Assistant', 
    description: 'Create marketing campaigns and content',
    icon: <Bot className="w-6 h-6" />
  },
  { 
    id: 'bidgpt', 
    name: 'BidGPT', 
    description: 'Generate accurate job quotes',
    icon: <Bot className="w-6 h-6" />
  },
  { 
    id: 'quickreply', 
    name: 'Quick Reply', 
    description: 'Draft professional responses',
    icon: <Bot className="w-6 h-6" />
  }
];

interface Props {
  onSelectAgent: (agent: Agent) => void;
}

export default function DashboardAgentSelector({ onSelectAgent }: Props) {
  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-dark-text">AI Assistants</h2>
      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              {agent.icon}
            </div>
            <h3 className="font-medium text-center dark:text-dark-text">{agent.name}</h3>
            <p className="text-sm text-gray-500 text-center mt-1">{agent.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}