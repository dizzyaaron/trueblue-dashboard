import React from 'react';
import { LineItem } from '../../types/quotes';

interface Props {
  items: LineItem[];
  onAddTax: () => void;
}

export default function QuoteTotals({ items, onAddTax }: Props) {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div className="border-t pt-4">
      <div className="flex justify-end space-y-2">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span className="dark:text-dark-text">Subtotal</span>
            <span className="font-medium dark:text-dark-text">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="dark:text-dark-text">Tax</span>
            <button 
              onClick={onAddTax}
              className="text-primary hover:text-primary-dark text-sm"
            >
              Add Tax
            </button>
          </div>
          <div className="flex justify-between">
            <span className="font-medium dark:text-dark-text">Total</span>
            <span className="font-medium dark:text-dark-text">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}