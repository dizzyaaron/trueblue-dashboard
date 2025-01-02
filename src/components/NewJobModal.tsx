import React, { useState, useEffect } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { useJobStore } from '../store/jobStore';
import { useCustomerStore } from '../store/customerStore';
import { Customer } from '../types';
import { differenceInDays, addDays, isSunday, format } from 'date-fns';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewJobModal({ isOpen, onClose }: NewJobModalProps) {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { customers, addCustomer } = useCustomerStore();
  const { addJob } = useJobStore();
  
  const [jobData, setJobData] = useState({
    title: '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    description: '',
    startDate: '',
    endDate: '',
    workingDays: 0,
    estimatedHours: '',
    price: '',
    priority: 'normal',
    leadSource: ''
  });

  useEffect(() => {
    if (jobData.startDate && jobData.endDate) {
      const start = new Date(jobData.startDate);
      const end = new Date(jobData.endDate);
      let days = 0;
      let currentDate = start;

      while (currentDate <= end) {
        if (!isSunday(currentDate)) {
          days++;
        }
        currentDate = addDays(currentDate, 1);
      }

      setJobData(prev => ({ ...prev, workingDays: days }));
    }
  }, [jobData.startDate, jobData.endDate]);

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsNewCustomer(true);
      setJobData(prev => ({
        ...prev,
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: ''
      }));
    } else if (value === '') {
      setIsNewCustomer(false);
      setJobData(prev => ({
        ...prev,
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: ''
      }));
    } else {
      setIsNewCustomer(false);
      const customer = customers.find(c => c.id === value);
      if (customer) {
        setJobData(prev => ({
          ...prev,
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let customerId = jobData.customerId;
    
    if (isNewCustomer) {
      const newCustomer: Customer = {
        id: `c${Date.now()}`,
        name: jobData.customerName,
        email: jobData.customerEmail,
        phone: jobData.customerPhone,
        address: jobData.customerAddress,
        notes: '',
        createdAt: new Date().toISOString()
      };
      addCustomer(newCustomer);
      customerId = newCustomer.id;
    }

    const newJob = {
      id: `j${Date.now()}`,
      customerId,
      title: jobData.title,
      description: jobData.description,
      status: 'pending',
      scheduledDate: jobData.startDate,
      endDate: jobData.endDate,
      workingDays: jobData.workingDays,
      location: isNewCustomer ? jobData.customerAddress : customers.find(c => c.id === customerId)?.address || '',
      price: parseFloat(jobData.price) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addJob(newJob);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setJobData({
        title: '',
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        description: '',
        startDate: '',
        endDate: '',
        workingDays: 0,
        estimatedHours: '',
        price: '',
        priority: 'normal',
        leadSource: ''
      });
      setIsNewCustomer(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl my-8 relative">
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
          <h2 className="text-xl font-semibold text-text">Add New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                required
                className="input-primary"
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                className="input-primary"
                value={jobData.customerId}
                onChange={handleCustomerSelect}
                required
              >
                <option value="">Select Customer</option>
                <option value="new">Add New Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            {isNewCustomer && (
              <div className="space-y-4 border-l-2 border-primary pl-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required={isNewCustomer}
                    className="input-primary"
                    value={jobData.customerName}
                    onChange={(e) => setJobData({ ...jobData, customerName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required={isNewCustomer}
                      className="input-primary"
                      value={jobData.customerEmail}
                      onChange={(e) => setJobData({ ...jobData, customerEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required={isNewCustomer}
                      className="input-primary"
                      value={jobData.customerPhone}
                      onChange={(e) => setJobData({ ...jobData, customerPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required={isNewCustomer}
                    className="input-primary"
                    value={jobData.customerAddress}
                    onChange={(e) => setJobData({ ...jobData, customerAddress: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="input-primary"
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className="input-primary"
                  value={jobData.startDate}
                  onChange={(e) => setJobData({ ...jobData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  className="input-primary"
                  value={jobData.endDate}
                  min={jobData.startDate}
                  onChange={(e) => setJobData({ ...jobData, endDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Days
                </label>
                <input
                  type="number"
                  className="input-primary"
                  value={jobData.workingDays}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="input-primary"
                value={jobData.price}
                onChange={(e) => setJobData({ ...jobData, price: e.target.value })}
              />
            </div>
          </form>
        </div>

        <div className="border-t p-6">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="btn-primary"
            >
              Create Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}