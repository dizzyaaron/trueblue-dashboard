import React, { useState } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import NewInvoiceModal from '../components/NewInvoiceModal';

const mockInvoices = [
  {
    id: 'INV-001',
    customer: 'Alice Johnson',
    jobTitle: 'Bathroom Renovation',
    amount: 2500,
    status: 'paid',
    dueDate: '2024-03-15',
    issuedDate: '2024-03-01',
  },
];

const statusColors = {
  'paid': 'bg-green-100 text-green-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'overdue': 'bg-red-100 text-red-800',
};

export default function Invoices() {
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Invoices</h1>
        <button 
          className="btn-primary"
          onClick={() => setIsNewInvoiceModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2 inline-block" /> Create Invoice
        </button>
      </div>

      {/* Rest of the existing code... */}

      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
      />
    </div>
  );
}