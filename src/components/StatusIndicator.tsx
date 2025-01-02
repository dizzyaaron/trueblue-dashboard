import React from 'react';

interface StatusIndicatorProps {
  status: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  active: 'bg-green-500',
  inactive: 'bg-red-500',
  pending: 'bg-yellow-500',
  'in-progress': 'bg-blue-500',
  completed: 'bg-green-500',
  draft: 'bg-gray-500',
  sent: 'bg-blue-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  new: 'bg-yellow-500',
  cancelled: 'bg-red-500',
  default: 'bg-gray-500'
} as const;

export default function StatusIndicator({ status, showText = true, size = 'md' }: StatusIndicatorProps) {
  const normalizedStatus = status.toLowerCase();
  const color = statusColors[normalizedStatus as keyof typeof statusColors] || statusColors.default;
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} ${color} rounded-full`} />
      {showText && (
        <span className="capitalize text-current">{status}</span>
      )}
    </div>
  );
}