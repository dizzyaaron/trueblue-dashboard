import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';
import { useCustomerStore } from '../../store/customerStore';

export default function LeadsAttention() {
  const { jobs } = useJobStore();
  const { customers } = useCustomerStore();

  const leads = jobs
    .filter(job => job.status === 'LEAD - Not Contacted')
    .map(job => ({
      job,
      customer: customers.find(c => c.id === job.customerId),
      daysSinceCreated: Math.floor(
        (new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    }))
    .sort((a, b) => b.daysSinceCreated - a.daysSinceCreated);

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-dark-text">
        Leads Requiring Attention
      </h2>
      <div className="space-y-4">
        {leads.map(({ job, customer, daysSinceCreated }) => (
          <div 
            key={job.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium dark:text-dark-text">{customer?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {job.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ${job.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{daysSinceCreated} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}