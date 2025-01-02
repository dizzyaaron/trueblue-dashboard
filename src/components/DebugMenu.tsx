import React, { useState } from 'react';
import { Bug, Bot, Check } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { useCustomerStore } from '../store/customerStore';
import { useAISettingsStore } from '../store/aiSettingsStore';
import { generateRandomCustomer, generateRandomJob } from '../utils/randomData';

export default function DebugMenu() {
  const { addJob } = useJobStore();
  const { addCustomer } = useCustomerStore();
  const { setApiKey } = useAISettingsStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const generateRandomData = () => {
    const customer = generateRandomCustomer();
    addCustomer(customer);
    const job = generateRandomJob(customer.id, customer.address);
    addJob(job);
  };

  const addDebugApiKey = () => {
    setApiKey('sk-debug-key-1234567890');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between relative">
      <div className="flex items-center gap-2">
        <Bug className="w-4 h-4" />
        <span className="text-sm font-medium">Debug Menu</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={addDebugApiKey}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center gap-2"
        >
          <Bot className="w-4 h-4" />
          Add Debug API Key
        </button>
        <button
          onClick={generateRandomData}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Add Random Job & Customer
        </button>
      </div>
      
      {showSuccess && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span className="text-sm">API Key Added Successfully</span>
        </div>
      )}
    </div>
  );
}