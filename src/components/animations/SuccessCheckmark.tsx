import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  message?: string;
}

export default function SuccessCheckmark({ message = 'Success!' }: Props) {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-10 animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-scale-up">
          <Check className="w-10 h-10 text-white animate-check" />
        </div>
        <p className="mt-4 text-lg font-medium text-white">{message}</p>
      </div>
    </div>
  );
}