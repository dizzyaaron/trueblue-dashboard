import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';
import { useJobStore } from '../../store/jobStore';

export default function ContactNeeded() {
  const { customers } = useCustomerStore();
  const { jobs } = useJobStore();

  const needsContact = customers.map(customer => {
    const customerJobs = jobs.filter(job => job.customerId === customer.id);
    const latestJob = customerJobs.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];

    return {
      customer,
      latestJob,
      daysSinceContact: latestJob ? 
        Math.floor((new Date().getTime() - new Date(latestJob.updatedAt).getTime()) / (1000 * 60 * 60 * 24)) : 
        null
    };
  }).filter(({ daysSinceContact }) => daysSinceContact && daysSinceContact > 14);

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-dark-text">
        Needs Follow-up
      </h2>
      <div className="space-y-4">
        {needsContact.map(({ customer, latestJob, daysSinceContact }) => (
          <div 
            key={customer.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium dark:text-dark-text">{customer.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last Job: {latestJob?.title}
                </p>
              </div>
              <div className="flex items-center gap-2 text-yellow-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{daysSinceContact} days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}