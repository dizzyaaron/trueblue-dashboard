import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useCustomerStore } from '../store/customerStore';
import type { Customer } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewCustomerModal({ isOpen, onClose }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { addCustomer } = useCustomerStore();
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCustomer: Customer = {
      id: `c${Date.now()}`,
      ...customerData,
      createdAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString()
    };

    addCustomer(newCustomer);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setCustomerData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl relative">
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
          <h2 className="text-xl font-semibold text-text">Add New Customer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="input-primary"
              value={customerData.name}
              onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="input-primary"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                className="input-primary"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              required
              className="input-primary"
              value={customerData.address}
              onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              className="input-primary"
              value={customerData.notes}
              onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}