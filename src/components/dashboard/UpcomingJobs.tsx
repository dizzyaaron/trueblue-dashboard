import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';
import { useCustomerStore } from '../../store/customerStore';
import { format, isAfter } from 'date-fns';

export default function UpcomingJobs() {
  const { jobs } = useJobStore();
  const { customers } = useCustomerStore();
  
  const upcomingJobs = jobs
    .filter(job => isAfter(new Date(job.scheduledDate), new Date()))
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-dark-text">
        <Calendar className="w-5 h-5 text-primary" />
        Upcoming Jobs
      </h2>
      <div className="space-y-3">
        {upcomingJobs.map(job => {
          const customer = customers.find(c => c.id === job.customerId);
          return (
            <div
              key={job.id}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 
                       dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium dark:text-dark-text">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{customer?.name}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Clock className="w-4 h-4" />
                  {format(new Date(job.scheduledDate), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}