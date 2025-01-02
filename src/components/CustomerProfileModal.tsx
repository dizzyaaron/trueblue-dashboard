import React from 'react';
import { X } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import { useJobStore } from '../store/jobStore';
import CustomerProfile from './CustomerProfile';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

export default function CustomerProfileModal({ isOpen, onClose, customerId }: CustomerProfileModalProps) {
  const { customers } = useCustomerStore();
  const { jobs } = useJobStore();
  
  if (!isOpen || !customerId) return null;

  const customer = customers.find(c => c.id === customerId);
  if (!customer) return null;

  const customerJobs = jobs.filter(job => job.customerId === customerId);
  const totalSpent = customerJobs.reduce((sum, job) => sum + job.price, 0);

  const customerData = {
    ...customer,
    totalJobs: customerJobs.length,
    totalSpent,
    rating: 4.8,
    joinDate: new Date(customer.createdAt).toLocaleDateString(),
    preferredServices: ['Plumbing', 'Electrical', 'Carpentry'],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        >
          <X className="w-6 h-6" />
        </button>
        
        <CustomerProfile customer={customerData} />
      </div>
    </div>
  );
}