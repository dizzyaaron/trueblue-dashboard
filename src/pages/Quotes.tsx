import React, { useState, useEffect } from 'react';
import { Plus, Info, Trash2, MoreVertical } from 'lucide-react';
import StatusIndicator from '../components/StatusIndicator';
import NewQuoteModal from '../components/modals/NewQuoteModal';
import QuoteViewerModal from '../components/modals/QuoteViewerModal';
import { useCustomerStore } from '../store/customerStore';
import { useQuoteStore } from '../store/quoteStore';
import { useNotificationStore } from '../store/notificationStore';
import type { Quote } from '../types';

export default function Quotes() {
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const { quotes, deleteQuote } = useQuoteStore();
  const { customers } = useCustomerStore();
  const { addNotification } = useNotificationStore();
  const [showDeleteButton, setShowDeleteButton] = useState<string | null>(null);

  useEffect(() => {
    // Check drafts every minute
    const interval = setInterval(() => {
      const now = new Date();
      quotes
        .filter(quote => quote.status === 'draft')
        .forEach(quote => {
          const draftAge = (now.getTime() - new Date(quote.createdAt).getTime()) / (1000 * 60 * 60);
          if (draftAge >= 24) {
            addNotification({
              id: `draft-${quote.id}`,
              title: 'Draft Quote Requires Attention',
              message: `Draft quote "${quote.title}" is over 24 hours old`,
              type: 'warning',
              actions: [
                {
                  label: 'Delete Draft',
                  onClick: () => deleteQuote(quote.id)
                },
                {
                  label: 'Edit Quote',
                  onClick: () => {/* Navigate to quote */}
                }
              ]
            });
          }
        });
    }, 60000);

    return () => clearInterval(interval);
  }, [quotes]);

  const handleDeleteQuote = (quoteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quote?')) {
      deleteQuote(quoteId);
      setShowDeleteButton(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Quotes</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-400">Draft</h3>
              <p className="text-2xl font-bold text-white mt-1">0</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-gray-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-400">Awaiting Response</h3>
              <p className="text-2xl font-bold text-white mt-1">0</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-400">Changes Requested</h3>
              <p className="text-2xl font-bold text-white mt-1">0</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-400">Approved</h3>
              <p className="text-2xl font-bold text-white mt-1">0</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
        </div>
      </div>

      {/* Drafts Section */}
      {quotes.some(q => q.status === 'draft') && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Draft Quotes</h2>
          <div className="space-y-4">
            {quotes
              .filter(q => q.status === 'draft')
              .map(quote => (
                <div key={quote.id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">{quote.title}</h3>
                    <p className="text-sm text-gray-400">
                      Created {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="btn-primary">
                    Continue Editing
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Conversion rate</h3>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">0%</span>
            <span className="text-sm text-gray-400">Past 30 days</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Sent</h3>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">0</span>
            <span className="text-sm text-gray-400">$0</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Converted</h3>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">0</span>
            <span className="text-sm text-gray-400">$0</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">All quotes</h2>
          <button 
            className="btn-primary"
            onClick={() => setIsNewQuoteModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2 inline-block" />
            New Quote
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-2">
            <span className="text-white">Status</span>
            <span className="text-gray-400">|</span>
            <span className="text-white">All</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">All</span>
            <span className="text-gray-400">|</span>
            <button className="text-gray-400 hover:text-white">Clear filters</button>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Let's create a quote and win new work</p>
            <button 
              onClick={() => setIsNewQuoteModalOpen(true)}
              className="btn-primary mt-4"
            >
              New Quote
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map(quote => {
              const customer = customers.find(c => c.id === quote.customerId);
              return (
                <div 
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 cursor-pointer relative"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{quote.title}</h3>
                      <p className="text-sm text-gray-400">{customer?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-medium text-white">
                          ${quote.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 text-right">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteButton(showDeleteButton === quote.id ? null : quote.id);
                          }}
                          className="p-2 hover:bg-gray-500 rounded-full"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </button>
                        {showDeleteButton === quote.id && (
                          <button
                            onClick={(e) => handleDeleteQuote(quote.id, e)}
                            className="absolute right-0 top-full mt-1 p-2 bg-red-500 hover:bg-red-600 
                                     rounded-full shadow-lg transition-all duration-300 animate-scale-up"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        )}
                      </div>
                      <StatusIndicator status={quote.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewQuoteModal
        isOpen={isNewQuoteModalOpen}
        onClose={() => setIsNewQuoteModalOpen(false)}
        onSave={(quoteId) => {
          console.log('Quote saved:', quoteId);
          setIsNewQuoteModalOpen(false);
        }}
      />
      {selectedQuote && (
        <QuoteViewerModal
          isOpen={true}
          onClose={() => setSelectedQuote(null)}
          quote={selectedQuote}
        />
      )}
    </div>
  );
}