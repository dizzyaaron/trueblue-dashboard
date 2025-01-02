import React from 'react';
import { Plus } from 'lucide-react';
import QuoteLineItem from './QuoteLineItem';
import { LineItem } from '../../types/quotes';

interface Props {
  items: LineItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: string, value: string | number) => void;
}

export default function QuoteLineItems({ items, onAddItem, onUpdateItem }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium dark:text-dark-text">Line Items</h3>
        <button onClick={onAddItem} className="text-primary hover:text-primary-dark">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <QuoteLineItem
            key={item.id}
            item={item}
            onChange={(field, value) => onUpdateItem(item.id, field, value)}
          />
        ))}
      </div>
    </div>
  );
}