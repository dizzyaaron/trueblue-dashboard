import React, { useState } from 'react';
import { Image, FileText } from 'lucide-react';
import QuoteHeader from './QuoteHeader';
import QuoteLineItems from './QuoteLineItems';
import QuoteTotals from './QuoteTotals';
import { LineItem } from '../../types/quotes';

export default function QuoteForm() {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ 
    id: '1', 
    name: '', 
    description: '', 
    quantity: 1, 
    price: 0 
  }]);
  const [clientMessage, setClientMessage] = useState('');
  const [disclaimer, setDisclaimer] = useState(
    'This quote is valid for the next 30 days, after which values may be subject to change.'
  );
  const [internalNotes, setInternalNotes] = useState('');

  const addLineItem = () => {
    setLineItems([...lineItems, { 
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      price: 0
    }]);
  };

  const updateLineItem = (id: string, field: string, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddTax = () => {
    // Implement tax logic
  };

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <div className="space-y-6">
        <QuoteHeader
          selectedCustomer={selectedCustomer}
          onCustomerChange={setSelectedCustomer}
          jobTitle={jobTitle}
          onJobTitleChange={setJobTitle}
        />

        <QuoteLineItems
          items={lineItems}
          onAddItem={addLineItem}
          onUpdateItem={updateLineItem}
        />

        <QuoteTotals
          items={lineItems}
          onAddTax={handleAddTax}
        />

        {/* Client Message */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-text">
            Client Message
          </label>
          <textarea
            className="input-primary min-h-[100px] dark:bg-gray-800 dark:text-dark-text"
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
          />
        </div>

        {/* Disclaimer */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-text">
            Contract / Disclaimer
          </label>
          <textarea
            className="input-primary dark:bg-gray-800 dark:text-dark-text"
            value={disclaimer}
            onChange={(e) => setDisclaimer(e.target.value)}
          />
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-text">
            Internal Notes
          </label>
          <textarea
            className="input-primary min-h-[100px] dark:bg-gray-800 dark:text-dark-text"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-4">
            <button className="flex items-center gap-2 text-primary hover:text-primary-dark">
              <Image className="w-4 h-4" />
              Add Image
            </button>
            <button className="flex items-center gap-2 text-primary hover:text-primary-dark">
              <FileText className="w-4 h-4" />
              Add File
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button className="btn-primary">
            Create Quote
          </button>
        </div>
      </div>
    </div>
  );
}