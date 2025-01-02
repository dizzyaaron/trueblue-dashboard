import React from 'react';
import { Bot, AlertCircle, CheckCircle2, WifiOff } from 'lucide-react';
import { useAISettingsStore } from '../store/aiSettingsStore';

export default function AIStatusIndicator() {
  const { apiKey, isOfflineMode } = useAISettingsStore();

  if (!apiKey) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle className="w-4 h-4" />
        <span className="text-[8px] mr-4">AI Not Connected</span>
      </div>
    );
  }

  if (isOfflineMode) {
    return (
      <div className="flex items-center gap-2 text-yellow-500">
        <WifiOff className="w-4 h-4" />
        <span className="text-[8px] mr-4">Offline Mode</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-500">
      <Bot className="w-4 h-4" />
      <span className="text-[8px] mr-4">AI Connected</span>
    </div>
  );
}