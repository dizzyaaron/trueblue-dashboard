import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, AlertCircle } from 'lucide-react';
import { sendChatMessage, getAgentPrompt } from '../../utils/openai';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface Props {
  agentName: string;
  onClose: () => void;
}

export default function DashboardChat({ agentName, onClose }: Props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const systemMessage = {
        role: 'system',
        content: getAgentPrompt(agentName)
      };

      const response = await sendChatMessage([
        systemMessage,
        ...messages.map(m => ({ ...m, role: m.role as 'user' | 'assistant' })),
        userMessage
      ]);

      // Check if response contains error message
      if (response.startsWith('[')) {
        const errorMessage = response.split('\n\n')[0];
        setError(errorMessage.slice(1, -1));
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.includes('\n\n') ? response.split('\n\n')[1] : response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl w-full max-w-2xl shadow-lg animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700/50">
          <h3 className="font-semibold dark:text-dark-text">Chat with {agentName}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="h-[400px] p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mb-4">
              <p>Start chatting with {agentName}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.role === 'assistant'
                        ? 'bg-white/50 dark:bg-gray-700/50'
                        : 'bg-primary/90 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
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
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="input-primary flex-1 bg-white/50 dark:bg-gray-800/50 dark:text-dark-text"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!message.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}