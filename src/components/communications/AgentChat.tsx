import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, WifiOff } from 'lucide-react';
import { sendChatMessage } from '../../utils/openai/api';
import { useAISettingsStore } from '../../store/aiSettingsStore';
import type { Message } from '../../utils/openai/types';

interface Props {
  agentName: string;
  onSendMessage: (message: string) => void;
}

export default function AgentChat({ agentName, onSendMessage }: Props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isOfflineMode } = useAISettingsStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: message.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage([
        { role: 'system', content: `You are ${agentName}, an AI assistant.` },
        ...messages,
        userMessage
      ]);

      if (response.startsWith('[')) {
        const [errorMessage, content] = response.split('\n\n');
        setError(errorMessage.slice(1, -1));
        
        const assistantMessage: Message = {
          role: 'assistant',
          content: content
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

      onSendMessage(message);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      {isOfflineMode && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg flex items-center gap-2">
          <WifiOff className="w-5 h-5" />
          <p className="text-sm">Running in offline mode - Using AI response templates</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Rest of the component remains the same */}
    </div>
  );
}