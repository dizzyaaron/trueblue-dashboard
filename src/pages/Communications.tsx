import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import MessageStats from '../components/MessageStats';
import MessageTemplates from '../components/MessageTemplates';
import MessageList from '../components/MessageList';
import ContactNeeded from '../components/communications/ContactNeeded';
import LeadsAttention from '../components/communications/LeadsAttention';
import CommunicationsHeader from '../components/communications/CommunicationsHeader';
import AgentSelector from '../components/communications/AgentSelector';
import AgentChat from '../components/communications/AgentChat';
import { Template, Message } from '../types';

const agents = [
  { id: 'marketing', name: 'Marketing', description: 'Help with marketing campaigns and content' },
  { id: 'bidgpt', name: 'BidGPT', description: 'Assist with creating accurate job quotes' },
  { id: 'quickreply', name: 'Quick Reply', description: 'Generate professional responses' }
];

const mockMessages: Message[] = [
  {
    id: '1',
    type: 'email',
    from: 'alice@example.com',
    subject: 'Quote Request - Kitchen Remodel',
    preview: "Hi, I'm interested in getting a quote for...",
    date: '2024-03-12',
    status: 'unread',
  },
  {
    id: '2',
    type: 'sms',
    from: '+1 (555) 123-4567',
    subject: 'Appointment Confirmation',
    preview: 'Your appointment for tomorrow at 2 PM is confirmed...',
    date: '2024-03-12',
    status: 'read',
  },
];

const templates: Template[] = [
  {
    id: '1',
    name: 'Quote Follow-up',
    subject: 'Following up on your quote request',
    content: 'Thank you for requesting a quote from True Blue Handyman...',
  },
  {
    id: '2',
    name: 'Appointment Confirmation',
    subject: 'Your appointment is confirmed',
    content: 'This message confirms your appointment with True Blue Handyman...',
  },
];

export default function Communications() {
  const [activeTab, setActiveTab] = useState<'messages' | 'agents'>('messages');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // Implement message sending logic here
  };

  return (
    <div className="space-y-6">
      <CommunicationsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'messages' ? (
        <>
          <div className="flex justify-end">
            <button className="btn-primary">
              <Plus className="w-5 h-5 mr-2 inline-block" /> New Message
            </button>
          </div>

          <MessageStats />

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-6">
              <MessageTemplates 
                templates={templates} 
                onSelectTemplate={handleTemplateSelect} 
              />
              <ContactNeeded />
              <LeadsAttention />
            </div>
            <MessageList messages={mockMessages} />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <AgentSelector
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
          {selectedAgent && (
            <AgentChat
              agentName={agents.find(a => a.id === selectedAgent)?.name || ''}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      )}
    </div>
  );
}