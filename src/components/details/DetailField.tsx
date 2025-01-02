import React from 'react';

interface DetailFieldProps {
  label: string;
  value: string | number;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  type?: string;
}

export default function DetailField({ 
  label, 
  value, 
  isEditing,
  onChange,
  type = 'text'
}: DetailFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="input-primary dark:bg-gray-700 dark:text-dark-text"
        />
      ) : (
        <p className="text-gray-900 dark:text-dark-text">{value}</p>
      )}
    </div>
  );
}