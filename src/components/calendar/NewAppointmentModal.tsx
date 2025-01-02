import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';
import { useCustomerStore } from '../../store/customerStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewAppointmentModal({ isOpen, onClose }: Props) {
  const { addJob } = useJobStore();
  const { customers } = useCustomerStore();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [appointmentData, setAppointmentData] = useState({
    customerId: '',
    title: '',
    description: '',
    scheduledDate: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob = {
      id: `j${Date.now()}`,
      customerId: appointmentData.customerId,
      title: appointmentData.title,
      description: appointmentData.description,
      status: 'scheduled',
      scheduledDate: appointmentData.scheduledDate,
      location: appointmentData.location,
      price: 0,
      notes: appointmentData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addJob(newJob);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setAppointmentData({
        customerId: '',
        title: '',
        description: '',
        scheduledDate: '',
        startTime: '',
        endTime: '',
        location: '',
        notes: ''
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-xl relative">
        {showSuccess && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 flex items-center justify-center z-10 animate-fade-in rounded-xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-scale-up">
                <Check className="w-10 h-10 text-white animate-check" />
              </div>
              <p className="mt-4 text-lg font-medium dark:text-dark-text">Appointment Created!</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-text dark:text-dark-text">New Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer
            </label>
            <select
              required
              className="input-primary dark:bg-gray-700 dark:text-dark-text"
              value={appointmentData.customerId}
              onChange={(e) => setAppointmentData({ ...appointmentData, customerId: e.target.value })}
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="input-primary dark:bg-gray-700 dark:text-dark-text"
              value={appointmentData.title}
              onChange={(e) => setAppointmentData({ ...appointmentData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                className="input-primary dark:bg-gray-700 dark:text-dark-text"
                value={appointmentData.scheduledDate}
                onChange={(e) => setAppointmentData({ ...appointmentData, scheduledDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  required
                  className="input-primary dark:bg-gray-700 dark:text-dark-text"
                  value={appointmentData.startTime}
                  onChange={(e) => setAppointmentData({ ...appointmentData, startTime: e.target.value })}
                />
                <input
                  type="time"
                  required
                  className="input-primary dark:bg-gray-700 dark:text-dark-text"
                  value={appointmentData.endTime}
                  onChange={(e) => setAppointmentData({ ...appointmentData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              className="input-primary dark:bg-gray-700 dark:text-dark-text"
              value={appointmentData.location}
              onChange={(e) => setAppointmentData({ ...appointmentData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              className="input-primary dark:bg-gray-700 dark:text-dark-text"
              value={appointmentData.notes}
              onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}