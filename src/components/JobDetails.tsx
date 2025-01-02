import React, { useState } from 'react';
import { X, ChevronDown, Edit2 } from 'lucide-react';
import { Job } from '../types';
import { useCustomerStore } from '../store/customerStore';
import { useJobStore } from '../store/jobStore';

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  statuses: string[];
  isEditModalOpen: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
}

export default function JobDetails({ 
  job, 
  onClose, 
  statuses,
  isEditModalOpen,
  setIsEditModalOpen 
}: JobDetailsProps) {
  const { customers } = useCustomerStore();
  const { updateJob } = useJobStore();
  const customer = customers.find(c => c.id === job.customerId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);

  const handleStatusChange = (newStatus: string) => {
    if (isEditing) {
      setEditedJob(prev => ({ ...prev, status: newStatus.toLowerCase() }));
    } else {
      updateJob(job.id, { status: newStatus.toLowerCase() });
    }
  };

  const handleSaveChanges = () => {
    updateJob(job.id, editedJob);
    setIsEditing(false);
  };

  return (
    <div className={`rounded-xl shadow-sm p-6 mb-6 transition-all duration-300 ${
      isEditing ? 'bg-white' : 'bg-[#f5f5dc]'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text">{job.title}</h2>
          <p className="text-gray-600">Customer: {customer?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg transition-colors ${
                isEditing ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <span className="absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isEditing ? 'Cancel Edit' : 'Edit Job'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="relative">
            <select
              value={isEditing ? editedJob.status : job.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`input-primary appearance-none pr-10 transition-colors ${
                isEditing ? 'bg-white border-primary' : ''
              }`}
              disabled={!isEditing}
            >
              {statuses.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date
          </label>
          <input
            type="date"
            value={isEditing ? editedJob.scheduledDate : job.scheduledDate}
            onChange={(e) => isEditing && setEditedJob(prev => ({ 
              ...prev, 
              scheduledDate: e.target.value 
            }))}
            className={`input-primary transition-colors ${
              isEditing ? 'bg-white border-primary' : ''
            }`}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={isEditing ? editedJob.description : job.description}
          onChange={(e) => isEditing && setEditedJob(prev => ({ 
            ...prev, 
            description: e.target.value 
          }))}
          className={`input-primary min-h-[100px] transition-colors ${
            isEditing ? 'bg-white border-primary' : ''
          }`}
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={isEditing ? editedJob.location : job.location}
            onChange={(e) => isEditing && setEditedJob(prev => ({ 
              ...prev, 
              location: e.target.value 
            }))}
            className={`input-primary transition-colors ${
              isEditing ? 'bg-white border-primary' : ''
            }`}
            disabled={!isEditing}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={isEditing ? editedJob.price : job.price}
            onChange={(e) => isEditing && setEditedJob(prev => ({ 
              ...prev, 
              price: parseFloat(e.target.value) 
            }))}
            className={`input-primary transition-colors ${
              isEditing ? 'bg-white border-primary' : ''
            }`}
            disabled={!isEditing}
          />
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end animate-slide-up">
          <button
            onClick={handleSaveChanges}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}