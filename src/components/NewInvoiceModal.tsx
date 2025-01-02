import React, { useState } from 'react';
import { X, Check, DollarSign } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { useCustomerStore } from '../store/customerStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
}

export default function NewInvoiceModal({ isOpen, onClose, jobId }: Props) {
  const { jobs } = useJobStore();
  const { customers } = useCustomerStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    jobId: jobId || '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: '',
    dueDate: '',
    terms: 'Net 30'
  });

  const selectedJob = jobs.find(job => job.id === invoiceData.jobId);
  const customer = selectedJob ? customers.find(c => c.id === selectedJob.customerId) : null;

  const addLineItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
    }));
  };

  const updateLineItem = (index: number, field: string, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeLineItem = (index: number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((sum, item) => 
      sum + (item.quantity * item.rate), 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invoice creation logic
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl my-8 relative">
        {showSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-scale-up">
                <Check className="w-10 h-10 text-white animate-check" />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-text">Create New Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job
              </label>
              <select
                className="input-primary"
                value={invoiceData.jobId}
                onChange={(e) => setInvoiceData({ ...invoiceData, jobId: e.target.value })}
                required
              >
                <option value="">Select Job</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="input-primary"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          {selectedJob && customer && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Customer Details</h3>
              <p>{customer.name}</p>
              <p className="text-sm text-gray-600">{customer.address}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Line Items</h3>
              <button
                type="button"
                onClick={addLineItem}
                className="text-primary hover:text-primary-dark"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {invoiceData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    className="input-primary flex-1"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    className="input-primary w-20"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                    required
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    className="input-primary w-32"
                    value={item.rate}
                    onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="input-primary"
              rows={3}
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-lg font-semibold flex items-center gap-1">
              <DollarSign className="w-5 h-5" />
              Total: ${calculateTotal().toFixed(2)}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Invoice
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}