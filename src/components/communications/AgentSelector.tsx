import React from 'react';
import { Bot } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
}

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: string | null;
  onSelectAgent: (agentId: string) => void;
}

export default function AgentSelector({ agents, selectedAgent, onSelectAgent }: AgentSelectorProps) {
  return (
    <div className="flex gap-4 mb-6">
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onSelectAgent(agent.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            selectedAgent === agent.id
              ? 'bg-primary text-white'
              : 'bg-surface hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Bot className="w-5 h-5" />
          {agent.name}
        </button>
      ))}
    </div>
  );
}