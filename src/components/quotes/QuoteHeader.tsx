import React from 'react';
import { Star } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';

interface Props {
  selectedCustomer: string;
  onCustomerChange: (id: string) => void;
  jobTitle: string;
  onJobTitleChange: (title: string) => void;
}

export default function QuoteHeader({ 
  selectedCustomer, 
  onCustomerChange,
  jobTitle,
  onJobTitleChange
}: Props) {
  const { customers } = useCustomerStore();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 dark:text-dark-text">
          Select Customer
        </label>
        <select 
          className="input-primary dark:bg-gray-800 dark:text-dark-text"
          value={selectedCustomer}
          onChange={(e) => onCustomerChange(e.target.value)}
        >
          <option value="">Select a customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-text">
            Job Title
          </label>
          <input 
            type="text" 
            className="input-primary dark:bg-gray-800 dark:text-dark-text"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-dark-text">
            Rate Opportunity
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star key={rating} className="w-5 h-5 text-gray-300 cursor-pointer hover:text-yellow-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}