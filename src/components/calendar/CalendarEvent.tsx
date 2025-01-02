import React from 'react';
import { Job } from '../../types';
import { useCustomerStore } from '../../store/customerStore';

interface CalendarEventProps {
  job: Job;
  onClick: (job: Job) => void;
}

export default function CalendarEvent({ job, onClick }: CalendarEventProps) {
  const { customers } = useCustomerStore();
  const customer = customers.find(c => c.id === job.customerId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      onClick={() => onClick(job)}
      className={`p-2 rounded ${getStatusColor(job.status)} cursor-pointer hover:opacity-90 transition-opacity`}
    >
      <p className="font-medium text-sm">{job.title}</p>
      <p className="text-xs">{customer?.name}</p>
      <p className="text-xs opacity-75">
        ${job.price.toLocaleString()}
      </p>
    </div>
  );
}