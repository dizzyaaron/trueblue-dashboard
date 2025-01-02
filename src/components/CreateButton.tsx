import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import NewClientModal from './modals/NewClientModal';
import NewRequestModal from './modals/NewRequestModal';
import NewQuoteModal from './modals/NewQuoteModal';

interface CreateButtonProps {
  showExpanded?: boolean;
}

export default function CreateButton({ showExpanded = false }: CreateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'client' | 'request' | 'quote' | null>(null);

  const handleOptionClick = (type: 'client' | 'request' | 'quote') => {
    setActiveModal(type);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-primary-dark hover:text-white transition-colors w-full h-[46px]"
        >
          <Plus className="w-5 h-5 flex-shrink-0 mx-auto" />
          {showExpanded && (
            <span className="transition-opacity duration-200 whitespace-nowrap overflow-hidden">
              Create
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 animate-fade-in">
            <button
              onClick={() => handleOptionClick('client')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              New Client
            </button>
            <button
              onClick={() => handleOptionClick('request')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              New Request
            </button>
            <button
              onClick={() => handleOptionClick('quote')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              New Quote
            </button>
          </div>
        )}
      </div>

      <NewClientModal
        isOpen={activeModal === 'client'}
        onClose={() => setActiveModal(null)}
      />
      <NewRequestModal
        isOpen={activeModal === 'request'}
        onClose={() => setActiveModal(null)}
      />
      <NewQuoteModal
        isOpen={activeModal === 'quote'}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}