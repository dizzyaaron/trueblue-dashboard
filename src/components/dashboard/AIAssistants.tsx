import React from 'react';
import { Bot, MessageSquare, Calculator, Lightbulb } from 'lucide-react';

export default function AIAssistants() {
  const assistants = [
    {
      id: 'quoter',
      name: 'Quote Assistant',
      description: 'Generate accurate job quotes',
      icon: <Calculator className="w-6 h-6 text-primary" />,
    },
    {
      id: 'scheduler',
      name: 'Schedule Optimizer',
      description: 'Optimize your daily schedule',
      icon: <Lightbulb className="w-6 h-6 text-primary" />,
    },
    {
      id: 'support',
      name: 'Customer Support',
      description: 'Draft professional responses',
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
    }
  ];

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-dark-text">
        <Bot className="w-5 h-5 text-primary" />
        AI Assistants
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {assistants.map((assistant) => (
          <button
            key={assistant.id}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg 
                     hover:shadow-md transition-all text-center"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              {assistant.icon}
            </div>
            <h3 className="font-medium dark:text-dark-text">{assistant.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{assistant.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}