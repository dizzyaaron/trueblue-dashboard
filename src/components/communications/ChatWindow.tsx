import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { useAISettingsStore } from '../../store/aiSettingsStore';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  role: 'assistant' | 'user';
  timestamp: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { apiKey } = useAISettingsStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API response for now
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm here to help! This is a simulated response until the OpenAI API is connected.",
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to get response:', error);
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 flex flex-col items-center justify-center h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-secondary mb-4" />
        <h3 className="text-lg font-semibold mb-2 dark:text-dark-text">API Key Required</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please add your OpenAI API key in the settings to use the chat feature.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6 flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-primary text-white'
              }`}
            >
              <p className={message.role === 'assistant' ? 'dark:text-dark-text' : ''}>
                {message.content}
              </p>
              <span className="text-xs mt-1 block opacity-70">
                {format(message.timestamp, 'HH:mm')}
              </span>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input-primary flex-1 dark:bg-gray-800 dark:text-dark-text"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}