import React, { useState } from 'react';
import { Eye, EyeOff, Save, Trash2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useAISettingsStore } from '../../store/aiSettingsStore';

export default function APISettings() {
  const { apiKey, setApiKey, clearApiKey, isOfflineMode, setOfflineMode } = useAISettingsStore();
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const validationError = setApiKey(tempKey);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = () => {
    clearApiKey();
    setTempKey('');
    setError(null);
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold dark:text-dark-text">API Settings</h2>
        <button
          onClick={() => setOfflineMode(!isOfflineMode)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isOfflineMode 
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {isOfflineMode ? (
            <>
              <WifiOff className="w-4 h-4" />
              Offline Mode
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              Online Mode
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-dark-text">
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={tempKey}
              onChange={(e) => {
                setTempKey(e.target.value);
                setError(null);
              }}
              placeholder="Enter your OpenAI API key"
              className={`input-primary pr-10 dark:bg-gray-800 dark:text-dark-text ${
                error ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Key
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!tempKey || tempKey === apiKey}
            className={`btn-primary flex items-center gap-2 ${
              isSaved ? 'bg-green-500' : ''
            }`}
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Saved!' : 'Save Key'}
          </button>
        </div>
      </div>
    </div>
  );
}