import React from 'react';
import { Template } from '../types';

interface MessageTemplatesProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

const MessageTemplates: React.FC<MessageTemplatesProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div className="col-span-3 bg-surface rounded-xl shadow-sm p-4">
      <h2 className="font-semibold mb-4">Message Templates</h2>
      <div className="space-y-3">
        {templates.map(template => (
          <button
            key={template.id}
            className="w-full text-left p-3 rounded-lg hover:bg-background transition-colors"
            onClick={() => onSelectTemplate(template)}
          >
            <p className="font-medium text-text">{template.name}</p>
            <p className="text-sm text-gray-500 truncate">{template.subject}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MessageTemplates;