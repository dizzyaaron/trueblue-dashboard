import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { useRequestStore } from '../../store/requestStore';
import { useCustomerStore } from '../../store/customerStore';
import StatusIndicator from '../StatusIndicator';

export default function ActiveRequests() {
  const navigate = useNavigate();
  const { requests } = useRequestStore();
  const { customers } = useCustomerStore();
  
  // Get the 5 most recent requests
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recentRequests.length === 0) {
    return (
      <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-dark-text">
          <ClipboardList className="w-5 h-5 text-primary" />
          Active Requests
        </h2>
        <div className="text-center py-8 text-gray-500">
          No active requests yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-dark-surface rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-dark-text">
        <ClipboardList className="w-5 h-5 text-primary" />
        Active Requests
      </h2>
      <div className="space-y-3">
        {recentRequests.map(request => {
          const customer = customers.find(c => c.id === request.clientId);
          return (
            <div
              key={request.id}
              onClick={() => navigate('/requests')}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 
                       dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium dark:text-dark-text">{request.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{customer?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIndicator status={request.status} size="sm" />
                  <span className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button 
        onClick={() => navigate('/requests')}
        className="w-full mt-4 text-center text-primary hover:text-primary-dark text-sm"
      >
        View all requests
      </button>
    </div>
  );
}