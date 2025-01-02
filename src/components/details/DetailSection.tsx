import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

interface DetailSectionProps {
  title: string;
  onSave?: (data: any) => void;
  children: React.ReactNode;
  editable?: boolean;
}

export default function DetailSection({ 
  title, 
  onSave, 
  children,
  editable = true 
}: DetailSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave?.({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold dark:text-dark-text">{title}</h3>
        {editable && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
      <div className={isEditing ? 'animate-fade-in' : ''}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { isEditing });
          }
          return child;
        })}
      </div>
    </div>
  );
}