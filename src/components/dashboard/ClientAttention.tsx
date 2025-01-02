import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';
import { useCustomerStore } from '../../store/customerStore';
import { differenceInDays } from 'date-fns';

export default function ClientAttention() {
  const { jobs } = useJobStore();
  const { customers } = useCustomerStore();

  const attentionItems = jobs
    .map(job => {
      const customer = customers.find(c => c.id === job.customerId);
      if (!customer) return null;

      const lastContact = job.lastContactDate || customer.lastContactDate;
      if (!lastContact) return null;

      const daysSinceContact = differenceInDays(new Date(), new Date(lastContact));
      let attentionType = null;

      if (daysSinceContact > 7) {
        attentionType = {
          type: 'no_contact' as const,
          message: `No contact in ${daysSinceContact} days`
        };
      } else if (job.status === 'pending' && !job.price) {
        attentionType = {
          type: 'proposal_needed' as const,
          message: 'Proposal needed'
        };
      } else if (job.requiresAttention?.type === 'proposal_due') {
        attentionType = {
          type: 'proposal_due' as const,
          message: 'Proposal due tomorrow'
        };
      }

      if (!attentionType) return null;

      return {
        job,
        customer,
        attentionType
      };
    })
    .filter(Boolean);

  if (attentionItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-text dark:text-dark-text">
        <AlertCircle className="w-5 h-5 text-secondary" />
        Requires Attention
      </h2>
      <div className="space-y-3">
        {attentionItems.map(item => (
          <div
            key={item!.job.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium dark:text-dark-text">{item!.customer.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item!.job.title}
                </p>
              </div>
              <div className="flex items-center gap-2 text-secondary">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{item!.attentionType.message}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}