import React from 'react';
import { Image } from 'lucide-react';

interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface Props {
  item: LineItem;
  onChange: (field: string, value: string | number) => void;
}

export default function QuoteLineItem({ item, onChange }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-5">
        <input
          type="text"
          placeholder="Item name"
          className="input-primary dark:bg-gray-800 dark:text-dark-text"
          value={item.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="input-primary mt-2 dark:bg-gray-800 dark:text-dark-text"
          value={item.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
        <button className="mt-2 flex items-center gap-2 text-primary hover:text-primary-dark">
          <Image className="w-4 h-4" />
          Add Image
        </button>
      </div>
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Qty"
          className="input-primary dark:bg-gray-800 dark:text-dark-text"
          value={item.quantity}
          onChange={(e) => onChange('quantity', parseInt(e.target.value))}
          min="1"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          placeholder="Price"
          className="input-primary dark:bg-gray-800 dark:text-dark-text"
          value={item.price}
          onChange={(e) => onChange('price', parseFloat(e.target.value))}
          min="0"
          step="0.01"
        />
      </div>
      <div className="col-span-3">
        <p className="input-primary bg-gray-50 dark:bg-gray-700 dark:text-dark-text">
          ${(item.quantity * item.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
}